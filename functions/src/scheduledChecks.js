// functions/src/scheduledChecks.js
const admin = require('firebase-admin');
const fetch = require('node-fetch');
const {SendMailClient} =require("zeptomail")
const ZEPTOMAIL_URL = "https://api.zeptomail.com/v1.1/email";

 // Get environment variables
    const zeptomailToken = process.env.ZEPTOMAIL_TOKEN;
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || 'noreply@ishelter.everythingshelter.com.ng';
    const fromName = process.env.EMAIL_FROM_NAME || 'iShelter Notifications';

function getDb() {
  return admin.firestore();
}

async function checkOverdueItems() {
  const db = getDb();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

async function sendOverdueInvoiceNotification(projectId, projectData, invoice, invoiceId) {
  const db = getDb();
  
  try {
    const projectName = projectData.projectName || 'Project';
    const recipients = projectData.projectUsers || [];
    const projectManager = projectData.projectManager || null;
    
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients;
    
    // Get recipient UIDs
    const recipientIds = [];
    for (const userRef of allRecipients) {
      if (userRef && userRef.id) {
        recipientIds.push(userRef.id);
      }
    }
    
    // Get admin UIDs
    const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
    const adminIds = adminsSnapshot.docs.map(doc => doc.id);
    
    // Combine all recipients
    const allRecipientIds = [...new Set([...recipientIds, ...adminIds])];
    
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(invoice.amount);
    
    const daysOverdue = Math.floor((new Date() - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24));
    
    // Create notifications
    for (const uid of allRecipientIds) {
      await db.collection('notifications').add({
        title: `🚨 Overdue Invoice - ${projectName}`,
        body: `Invoice ${invoice.invoiceNumber} (${formattedAmount}) is ${daysOverdue} days overdue. Please make payment immediately.`,
        type: 'payment',
        recipientId: uid,
        projectId: projectId,
        relatedId: invoiceId,
        actionUrl: `/dashboard/project-details/${projectId}`,
        isGlobal: false,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Send emails
    await sendOverdueEmail({
      projectName,
      recipients: allRecipients,
      type: 'invoice',
      details: {
        invoiceNumber: invoice.invoiceNumber,
        amount: formattedAmount,
        daysOverdue
      }
    });
    
    console.log(`✅ Sent overdue invoice notification for ${invoice.invoiceNumber}`);
  } catch (error) {
    console.error('Error sending overdue invoice notification:', error);
  }
}

async function sendOverdueStageNotification(projectId, projectData, stage) {
  const db = getDb();
  
  try {
    const projectName = projectData.projectName || 'Project';
    const recipients = projectData.projectUsers || [];
    const projectManager = projectData.projectManager || null;
    
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients;
    
    // Get recipient UIDs
    const recipientIds = [];
    for (const userRef of allRecipients) {
      if (userRef && userRef.id) {
        recipientIds.push(userRef.id);
      }
    }
    
    // Get admin UIDs
    const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
    const adminIds = adminsSnapshot.docs.map(doc => doc.id);
    
    // Combine all recipients
    const allRecipientIds = [...new Set([...recipientIds, ...adminIds])];
    
    const daysOverdue = Math.floor((new Date() - new Date(stage.dueDate.end)) / (1000 * 60 * 60 * 24));
    
    // Create notifications
    for (const uid of allRecipientIds) {
      await db.collection('notifications').add({
        title: `⚠️ Overdue Stage - ${projectName}`,
        body: `Stage "${stage.name}" is ${daysOverdue} days overdue and still ${stage.status}.`,
        type: 'deadline',
        recipientId: uid,
        projectId: projectId,
        actionUrl: `/dashboard/project-details/${projectId}`,
        isGlobal: false,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Send emails
    await sendOverdueEmail({
      projectName,
      recipients: allRecipients,
      type: 'stage',
      details: {
        name: stage.name,
        daysOverdue,
        status: stage.status
      }
    });
    
    console.log(`✅ Sent overdue stage notification for ${stage.name}`);
  } catch (error) {
    console.error('Error sending overdue stage notification:', error);
  }
}

async function sendOverdueTaskNotification(projectId, projectData, stage, task) {
  const db = getDb();
  
  try {
    const projectName = projectData.projectName || 'Project';
    const recipients = projectData.projectUsers || [];
    const projectManager = projectData.projectManager || null;
    
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients;
    
    // Get recipient UIDs
    const recipientIds = [];
    for (const userRef of allRecipients) {
      if (userRef && userRef.id) {
        recipientIds.push(userRef.id);
      }
    }
    
    // Get admin UIDs
    const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
    const adminIds = adminsSnapshot.docs.map(doc => doc.id);
    
    // Combine all recipients
    const allRecipientIds = [...new Set([...recipientIds, ...adminIds])];
    
    const daysOverdue = Math.floor((new Date() - new Date(task.dueDate.end)) / (1000 * 60 * 60 * 24));
    
    // Create notifications
    for (const uid of allRecipientIds) {
      await db.collection('notifications').add({
        title: `⚠️ Overdue Task - ${projectName}`,
        body: `Task "${task.name}" in stage "${stage.name}" is ${daysOverdue} days overdue and still ${task.status}.`,
        type: 'deadline',
        recipientId: uid,
        projectId: projectId,
        actionUrl: `/dashboard/project-details/${projectId}`,
        isGlobal: false,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    // Send emails
    await sendOverdueEmail({
      projectName,
      recipients: allRecipients,
      type: 'task',
      details: {
        name: task.name,
        stageName: stage.name,
        daysOverdue,
        status: task.status
      }
    });
    
    console.log(`✅ Sent overdue task notification for ${task.name}`);
  } catch (error) {
    console.error('Error sending overdue task notification:', error);
  }
}



async function sendOverdueEmail({ projectName, recipients, type, details }) {
  const db = getDb();
  
  try {
    // Get recipient emails
    const emails = [];
    for (const userRef of recipients) {
      if (userRef && userRef.id) {
        const userDoc = await db.collection('users').doc(userRef.id).get();
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.email && !userData.disabled) {
            emails.push({
              email_address: {
                address: userData.email,
                name: userData.displayName || userData.email.split('@')[0]
              }
            });
          }
        }
      }
    }
    
    // Get admin emails
    const adminsSnapshot = await db.collection('users').where('role', '==', 'admin').get();
    adminsSnapshot.forEach(doc => {
      const adminData = doc.data();
      if (adminData.email && !adminData.disabled) {
        emails.push({
          email_address: {
            address: adminData.email,
            name: adminData.displayName || adminData.email.split('@')[0]
          }
        });
      }
    });
    
    // Remove duplicates by email address
    const uniqueEmails = Array.from(new Map(emails.map(item => 
      [item.email_address.address, item]
    )).values());
    
    if (uniqueEmails.length === 0) {
      console.log('No emails to send');
      return;
    }
    
    // Build email content based on type
    let subject, htmlbody;
    
    if (type === 'invoice') {
      subject = `🚨 Overdue Invoice - ${projectName}`;
      htmlbody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Overdue Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .alert { background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .details { background-color: white; padding: 20px; border-radius: 4px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 Invoice Overdue</h1>
          </div>
          <div class="content">
            <p>Dear Team,</p>
            <p>An invoice for project <strong>${projectName}</strong> is overdue and requires immediate attention.</p>
            
            <div class="details">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice Number:</strong> ${details.invoiceNumber}</p>
              <p><strong>Amount Due:</strong> ${details.amount}</p>
              <p><strong>Days Overdue:</strong> ${details.daysOverdue} days</p>
            </div>
            
            <div class="alert">
              <p><strong>⚠️ Important:</strong> This invoice is now <strong>${details.daysOverdue} days overdue</strong>. Please make payment immediately to avoid further penalties or service interruption.</p>
            </div>
            
            <p>Best regards,<br>The iShelter Team</p>
            
            <div class="footer">
              <p>This is an automated notification from iShelter Project Management System.</p>
              <p>If you believe this is an error, please contact your system administrator.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'stage') {
      subject = `⚠️ Overdue Stage - ${projectName}`;
      htmlbody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Overdue Stage</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ea580c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .alert { background-color: #fff7ed; border: 1px solid #fed7aa; color: #ea580c; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .details { background-color: white; padding: 20px; border-radius: 4px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⚠️ Stage Overdue</h1>
          </div>
          <div class="content">
            <p>Dear Team,</p>
            <p>A project stage for <strong>${projectName}</strong> is overdue and requires your attention.</p>
            
            <div class="details">
              <h3>Stage Details:</h3>
              <p><strong>Stage Name:</strong> ${details.name}</p>
              <p><strong>Current Status:</strong> ${details.status}</p>
              <p><strong>Days Overdue:</strong> ${details.daysOverdue} days</p>
            </div>
            
            <div class="alert">
              <p><strong>📋 Action Required:</strong> This stage should have been completed by now. Please update the status or take necessary action to complete this stage.</p>
            </div>
            
            <p>Best regards,<br>The iShelter Team</p>
            
            <div class="footer">
              <p>This is an automated notification from iShelter Project Management System.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'task') {
      subject = `⚠️ Overdue Task - ${projectName}`;
      htmlbody = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Overdue Task</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ea580c; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
            .alert { background-color: #fff7ed; border: 1px solid #fed7aa; color: #ea580c; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .details { background-color: white; padding: 20px; border-radius: 4px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⚠️ Task Overdue</h1>
          </div>
          <div class="content">
            <p>Dear Team,</p>
            <p>A task for project <strong>${projectName}</strong> is overdue and requires your attention.</p>
            
            <div class="details">
              <h3>Task Details:</h3>
              <p><strong>Task Name:</strong> ${details.name}</p>
              <p><strong>Stage:</strong> ${details.stageName}</p>
              <p><strong>Current Status:</strong> ${details.status}</p>
              <p><strong>Days Overdue:</strong> ${details.daysOverdue} days</p>
            </div>
            
            <div class="alert">
              <p><strong>📋 Action Required:</strong> This task should have been completed by now. Please update the status or take necessary action to complete this task.</p>
            </div>
            
            <p>Best regards,<br>The iShelter Team</p>
            
            <div class="footer">
              <p>This is an automated notification from iShelter Project Management System.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }
    
   
    
    if (!zeptomailToken) {
      console.error('ZEPTOMAIL_TOKEN environment variable is not set');
      return;
    }
    
    // Initialize ZeptoMail client
    const client = new SendMailClient({
      url: ZEPTOMAIL_URL,
      token: zeptomailToken
    });
    
    // Send email via ZeptoMail
    await client.sendMail({
      "from": {
        "address": fromAddress,
        "name": fromName
      },
      "to": uniqueEmails,
      "subject": subject,
      "htmlbody": htmlbody
    });
    
    console.log(`✅ Sent overdue email to ${uniqueEmails.length} recipients via ZeptoMail`);
  } catch (error) {
    console.error('Error sending overdue email via ZeptoMail:', error);
  }
}

module.exports = { checkOverdueItems };