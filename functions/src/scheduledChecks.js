const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Lazy initialization for admin and db
function getAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin;
}

function getDb() {
  return getAdmin().firestore();
}

async function checkOverdueItems() {
  const db = getDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of day

  const projectsSnapshot = await db.collection('projects').get();
  let totalNotifications = 0;

  for (const projectDoc of projectsSnapshot.docs) {
    const projectId = projectDoc.id;
    const projectData = projectDoc.data();

    console.log(`📋 Checking project: ${projectData.projectName || projectId}`);

    const invoiceCount = await checkOverdueInvoices(projectId, projectData, today);
    const taskCount = await checkOverdueTasksAndStages(projectId, projectData, today);

    totalNotifications += invoiceCount + taskCount;
  }

  console.log(`✅ Sent ${totalNotifications} overdue notifications`);
  return totalNotifications;
}

// --- Overdue invoices ---
async function checkOverdueInvoices(projectId, projectData, today) {
  const db = getDb();

  try {
    const invoicesSnapshot = await db
      .collection('invoices')
      .where('projectRef', '==', db.doc(`projects/${projectId}`))
      .where('status', '!=', 'paid')
      .get();

    let count = 0;

    for (const invoiceDoc of invoicesSnapshot.docs) {
      const invoice = invoiceDoc.data();
      const dueDate = new Date(invoice.dueDate);

      if (dueDate < today && !wasNotifiedToday(invoice.lastOverdueNotification)) {
        await sendOverdueInvoiceNotification(projectId, projectData, invoice, invoiceDoc.id);

        await invoiceDoc.ref.update({
          lastOverdueNotification: admin.firestore.FieldValue.serverTimestamp()
        });

        count++;
      }
    }

    return count;
  } catch (error) {
    console.error('Error checking overdue invoices:', error);
    return 0;
  }
}

// --- Overdue tasks & stages ---
async function checkOverdueTasksAndStages(projectId, projectData, today) {
  const db = getDb();

  try {
    const taskTimeline = projectData.taskTimeline || [];
    let count = 0;

    for (const stage of taskTimeline) {
      if (stage.status !== 'Completed' && stage.dueDate?.end) {
        const stageEndDate = new Date(stage.dueDate.end);

        if (stageEndDate < today && !wasNotifiedToday(stage.lastOverdueNotification)) {
          await sendOverdueStageNotification(projectId, projectData, stage);
          stage.lastOverdueNotification = new Date().toISOString();
          count++;
        }
      }

      if (stage.tasks) {
        for (const task of stage.tasks) {
          if (task.status !== 'Completed' && task.dueDate?.end) {
            const taskEndDate = new Date(task.dueDate.end);

            if (taskEndDate < today && !wasNotifiedToday(task.lastOverdueNotification)) {
              await sendOverdueTaskNotification(projectId, projectData, stage, task);
              task.lastOverdueNotification = new Date().toISOString();
              count++;
            }
          }
        }
      }
    }

    if (count > 0) {
      await db.collection('projects').doc(projectId).update({
        taskTimeline
      });
    }

    return count;
  } catch (error) {
    console.error('Error checking overdue tasks/stages:', error);
    return 0;
  }
}

// --- Helpers ---
function wasNotifiedToday(lastNotification) {
  if (!lastNotification) return false;

  const lastNotifDate = lastNotification.toDate 
    ? lastNotification.toDate() 
    : new Date(lastNotification);

  const today = new Date();

  return (
    lastNotifDate.getDate() === today.getDate() &&
    lastNotifDate.getMonth() === today.getMonth() &&
    lastNotifDate.getFullYear() === today.getFullYear()
  );
}

// --- Export ---
module.exports = { checkOverdueItems };
