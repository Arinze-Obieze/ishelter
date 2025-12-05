import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'
import { getTaskCreationEmailTemplate } from '@/utils/emailTemplates/taskCreationTemplate'
import { getOverdueTaskEmailTemplate } from '@/utils/emailTemplates/overdueTaskTemplate'

/**
 * Notify users when a project phase/stage is completed
 */
export async function notifyPhaseCompletion({
  projectId,
  phaseName,
  completedById,
  completedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for phase completion notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `Phase Completed - ${projectName}`,
      body: `🎉 "${phaseName}" has been completed! Moving to the next phase.`,
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: completedById,
      extra: {
        phaseName,
        action: 'phase-completion',
        completedByName
      }
    })

    console.log('✅ Phase completion notifications sent')
  } catch (err) {
    console.error('❌ Failed to send phase completion notification:', err)
  }
}

/**
 * Notify users when a task is completed
 */
export async function notifyTaskCompletion({
  projectId,
  taskName,
  stageName,
  completedById,
  completedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for task completion notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `Task Completed - ${projectName}`,
      body: `✅ "${taskName}" in ${stageName} has been completed`,
      type: 'task',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: completedById,
      extra: {
        taskName,
        stageName,
        action: 'task-completion',
        completedByName
      }
    })

    console.log('✅ Task completion notifications sent')
  } catch (err) {
    console.error('❌ Failed to send task completion notification:', err)
  }
}

/**
 * Notify users when a deadline is approaching
 */
export async function notifyDeadlineApproaching({
  projectId,
  itemName, // phase or task name
  itemType, // 'phase' or 'task'
  dueDate,
  daysUntilDue
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for deadline notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    // Include project manager in recipients if exists
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    const urgencyEmoji = daysUntilDue <= 1 ? '🚨' : daysUntilDue <= 3 ? '⚠️' : '📅'
    const timeMessage = daysUntilDue === 0 
      ? 'due today' 
      : daysUntilDue === 1 
        ? 'due tomorrow' 
        : `due in ${daysUntilDue} days`

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `${urgencyEmoji} Deadline Approaching - ${projectName}`,
      body: `"${itemName}" is ${timeMessage} (${new Date(dueDate).toLocaleDateString()})`,
      type: 'deadline',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      extra: {
        itemName,
        itemType,
        dueDate,
        daysUntilDue,
        action: 'deadline-reminder'
      }
    })

    console.log('✅ Deadline approaching notifications sent')
  } catch (err) {
    console.error('❌ Failed to send deadline notification:', err)
  }
}

/**
 * Notify users when project timeline is updated
 */
export async function notifyTimelineUpdate({
  projectId,
  updateType, // 'phase-added', 'deadline-changed', 'timeline-revised'
  description,
  updatedById,
  updatedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for timeline update notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    const updateMessages = {
      'phase-added': '📋 New phase added to timeline',
      'deadline-changed': '📅 Project deadline has been updated',
      'timeline-revised': '🔄 Project timeline has been revised'
    }

    const titleMessage = updateMessages[updateType] || 'Timeline Updated'

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `${titleMessage} - ${projectName}`,
      body: description || 'Check the updated project timeline',
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: updatedById,
      skipUserId: updatedById,
      extra: {
        updateType,
        action: 'timeline-update',
        updatedByName
      }
    })

    console.log('✅ Timeline update notifications sent')
  } catch (err) {
    console.error('❌ Failed to send timeline update notification:', err)
  }
}

/**
 * Send email via API endpoint
 */
async function sendEmail({ to, subject, message, name }) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        message,
        name,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    const data = await response.json()
    console.log('✅ Email sent successfully:', data)
    return data
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw error
  }
}

/**
 * Notify users when a new task is created
 * Sends both in-app notification and email
 */
export async function notifyTaskCreation({
  projectId,
  taskName,
  stageName,
  taskCost,
  startDate,
  endDate,
  createdById,
  createdByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for task creation notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    // Include project manager in recipients if exists
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    // Send in-app notifications
    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `🎯 New Task Created - ${projectName}`,
      body: `"${taskName}" has been created in ${stageName}`,
      type: 'task',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: createdById,
      extra: {
        taskName,
        stageName,
        taskCost,
        startDate,
        endDate,
        action: 'task-creation',
        createdByName
      }
    })

    // Send emails to all recipients
    const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/project-details/${projectId}`
    
    for (const userRef of allRecipients) {
      try {
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          
          // Skip if user is disabled
          if (userData.disabled) continue

          const recipientName = userData.displayName || userData.name || userData.email || 'Valued User'
          const recipientEmail = userData.email

          if (recipientEmail) {
            const emailTemplate = getTaskCreationEmailTemplate({
              recipientName,
              projectName,
              stageName,
              taskName,
              taskCost,
              startDate: startDate || 'Not specified',
              endDate: endDate || 'Not specified',
              projectUrl
            })

            await sendEmail({
              to: recipientEmail,
              subject: `🎯 New Task Created: ${taskName} - ${projectName}`,
              message: emailTemplate,
              name: recipientName
            })
          }
        }
      } catch (error) {
        console.error('❌ Failed to send email to user:', error)
        // Continue to next user if one fails
      }
    }

    // Send emails to admins
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin')
      )
      const adminsSnap = await getDocs(adminsQuery)
      
      const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/project-overview/${projectId}`
      
      for (const adminDoc of adminsSnap.docs) {
        try {
          const adminData = adminDoc.data()
          
          if (adminData.disabled) continue

          const adminName = adminData.displayName || adminData.name || adminData.email || 'Admin'
          const adminEmail = adminData.email

          if (adminEmail) {
            const emailTemplate = getTaskCreationEmailTemplate({
              recipientName: adminName,
              projectName,
              stageName,
              taskName,
              taskCost,
              startDate: startDate || 'Not specified',
              endDate: endDate || 'Not specified',
              projectUrl
            })

            await sendEmail({
              to: adminEmail,
              subject: `🎯 New Task Created: ${taskName} - ${projectName}`,
              message: emailTemplate,
              name: adminName
            })
          }
        } catch (error) {
          console.error('❌ Failed to send email to admin:', error)
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch admins for email notification:', error)
    }

    console.log('✅ Task creation notifications and emails sent')
  } catch (err) {
    console.error('❌ Failed to send task creation notification:', err)
  }
}

/**
 * Check for overdue tasks and notify clients and admins
 * Should be called periodically (e.g., daily)
 */
export async function notifyOverdueTasks() {
  try {
    console.log('🔍 Starting overdue tasks check...')
    
    // Fetch all projects
    const projectsQuery = query(collection(db, 'projects'))
    const projectsSnap = await getDocs(projectsQuery)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let totalOverdueFound = 0

    for (const projectDoc of projectsSnap.docs) {
      try {
        const projectData = projectDoc.data()
        const projectId = projectDoc.id
        const projectName = projectData?.projectName || 'Project'
        const taskTimeline = projectData?.taskTimeline || []
        const recipients = projectData?.projectUsers || []
        const projectManager = projectData?.projectManager || null

        // Include project manager in recipients
        const allRecipients = projectManager ? [...recipients, projectManager] : recipients

        // Iterate through stages
        for (const stage of taskTimeline) {
          const stageName = stage.name || 'Unknown Stage'
          const tasks = stage.tasks || []

          // Check each task for overdue status
          for (const task of tasks) {
            // Parse end date
            let taskEndDate = null
            
            if (task.dueDate) {
              if (typeof task.dueDate === 'string') {
                // Handle "dec 15- dec 20" format - extract end date
                const datePart = task.dueDate.split('-').pop()?.trim()
                if (datePart) {
                  taskEndDate = new Date(datePart)
                }
              } else if (task.dueDate.end) {
                taskEndDate = new Date(task.dueDate.end)
              }
            }

            // Check if task is overdue and still ongoing/pending
            if (taskEndDate && taskEndDate < today && (task.status === 'Ongoing' || task.status === 'Pending')) {
              totalOverdueFound++
              
              const daysOverdue = Math.floor((today - taskEndDate) / (1000 * 60 * 60 * 24))
              
              console.log(`⏰ Found overdue task: ${task.name} in ${projectName}`)

              // Send in-app notifications
              try {
                await notifyUsers({
                  userRefs: allRecipients,
                  includeAdmins: true,
                  title: `🚨 Task Overdue - ${projectName}`,
                  body: `"${task.name}" in ${stageName} is overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`,
                  type: 'task',
                  projectId: projectId,
                  actionUrl: `/dashboard/project-details/${projectId}`,
                  extra: {
                    taskName: task.name,
                    stageName,
                    taskCost: task.cost,
                    daysOverdue,
                    action: 'overdue-task-alert'
                  }
                })
              } catch (error) {
                console.error('❌ Failed to send overdue notification:', error)
              }

              // Send emails to all recipients
              const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/project-details/${projectId}`
              
              for (const userRef of allRecipients) {
                try {
                  const userDoc = await getDoc(userRef)
                  if (userDoc.exists()) {
                    const userData = userDoc.data()
                    
                    if (userData.disabled) continue

                    const recipientName = userData.displayName || userData.name || userData.email || 'Valued User'
                    const recipientEmail = userData.email

                    if (recipientEmail) {
                      const emailTemplate = getOverdueTaskEmailTemplate({
                        recipientName,
                        projectName,
                        stageName,
                        taskName: task.name,
                        dueDate: task.dueDate?.end ? new Date(task.dueDate.end).toLocaleDateString() : task.dueDate,
                        taskCost: task.cost,
                        daysOverdue,
                        projectUrl
                      })

                      await sendEmail({
                        to: recipientEmail,
                        subject: `🚨 Task Overdue: ${task.name} - ${projectName}`,
                        message: emailTemplate,
                        name: recipientName
                      })
                    }
                  }
                } catch (error) {
                  console.error('❌ Failed to send overdue email to user:', error)
                }
              }

              // Send emails to admins
              try {
                const adminsQuery = query(
                  collection(db, 'users'),
                  where('role', '==', 'admin')
                )
                const adminsSnap = await getDocs(adminsQuery)
                
                const adminProjectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/project-overview/${projectId}`
                
                for (const adminDoc of adminsSnap.docs) {
                  try {
                    const adminData = adminDoc.data()
                    
                    if (adminData.disabled) continue

                    const adminName = adminData.displayName || adminData.name || adminData.email || 'Admin'
                    const adminEmail = adminData.email

                    if (adminEmail) {
                      const emailTemplate = getOverdueTaskEmailTemplate({
                        recipientName: adminName,
                        projectName,
                        stageName,
                        taskName: task.name,
                        dueDate: task.dueDate?.end ? new Date(task.dueDate.end).toLocaleDateString() : task.dueDate,
                        taskCost: task.cost,
                        daysOverdue,
                        projectUrl: adminProjectUrl
                      })

                      await sendEmail({
                        to: adminEmail,
                        subject: `🚨 Task Overdue: ${task.name} - ${projectName}`,
                        message: emailTemplate,
                        name: adminName
                      })
                    }
                  } catch (error) {
                    console.error('❌ Failed to send overdue email to admin:', error)
                  }
                }
              } catch (error) {
                console.error('❌ Failed to fetch admins for overdue email:', error)
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Error processing project for overdue tasks:', error)
      }
    }

    console.log(`✅ Overdue tasks check completed. Found ${totalOverdueFound} overdue tasks.`)
  } catch (err) {
    console.error('❌ Failed to check overdue tasks:', err)
  }
}

// utils/notifications/taskNotifications.js
// ADD THESE NEW FUNCTIONS TO THE EXISTING FILE



/**
 * Notify when a stage is created
 */
export async function notifyStageCreated({
  projectId,
  stageName,
  dueDate,
  cost,
  createdById,
  createdByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for stage creation notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    const formattedCost = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(cost || 0)

    const formattedDate = dueDate?.end 
      ? new Date(dueDate.end).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : 'Not set'

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `📋 New Stage Added - ${projectName}`,
      body: `${createdByName} added stage "${stageName}" | Due: ${formattedDate} | Cost: ${formattedCost}`,
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: createdById,
      skipUserId: createdById,
      extra: {
        stageName,
        dueDate,
        cost,
        action: 'stage-created'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'stage-created',
      details: {
        stageName,
        dueDate: formattedDate,
        cost: formattedCost,
        createdByName
      }
    })

    console.log('✅ Stage creation notifications sent')
  } catch (err) {
    console.error('❌ Failed to send stage creation notification:', err)
  }
}

/**
 * Notify when a stage is updated
 */
export async function notifyStageUpdated({
  projectId,
  stageName,
  changes,
  updatedById,
  updatedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) return

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    const changeDescription = changes.length > 0 ? changes.join(', ') : 'Stage updated'

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `🔄 Stage Updated - ${projectName}`,
      body: `${updatedByName} updated "${stageName}": ${changeDescription}`,
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: updatedById,
      skipUserId: updatedById,
      extra: {
        stageName,
        changes,
        action: 'stage-updated'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'stage-updated',
      details: {
        stageName,
        changes: changeDescription,
        updatedByName
      }
    })

    console.log('✅ Stage update notifications sent')
  } catch (err) {
    console.error('❌ Failed to send stage update notification:', err)
  }
}

/**
 * Notify when a stage is deleted
 */
export async function notifyStageDeleted({
  projectId,
  stageName,
  deletedById,
  deletedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) return

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `🗑️ Stage Deleted - ${projectName}`,
      body: `${deletedByName} deleted stage "${stageName}"`,
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: deletedById,
      skipUserId: deletedById,
      extra: {
        stageName,
        action: 'stage-deleted'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'stage-deleted',
      details: {
        stageName,
        deletedByName
      }
    })

    console.log('✅ Stage deletion notifications sent')
  } catch (err) {
    console.error('❌ Failed to send stage deletion notification:', err)
  }
}

/**
 * Notify when a task is created
 */
export async function notifyTaskCreated({
  projectId,
  taskName,
  stageName,
  dueDate,
  cost,
  createdById,
  createdByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) return

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    const formattedCost = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(cost || 0)

    const formattedDate = dueDate?.end 
      ? new Date(dueDate.end).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : 'Not set'

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `✅ New Task Added - ${projectName}`,
      body: `${createdByName} added task "${taskName}" in "${stageName}" | Due: ${formattedDate} | Cost: ${formattedCost}`,
      type: 'task',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: createdById,
      skipUserId: createdById,
      extra: {
        taskName,
        stageName,
        dueDate,
        cost,
        action: 'task-created'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'task-created',
      details: {
        taskName,
        stageName,
        dueDate: formattedDate,
        cost: formattedCost,
        createdByName
      }
    })

    console.log('✅ Task creation notifications sent')
  } catch (err) {
    console.error('❌ Failed to send task creation notification:', err)
  }
}

/**
 * Notify when a task is updated
 */
export async function notifyTaskUpdated({
  projectId,
  taskName,
  stageName,
  changes,
  updatedById,
  updatedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) return

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    const changeDescription = changes.length > 0 ? changes.join(', ') : 'Task updated'

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `🔄 Task Updated - ${projectName}`,
      body: `${updatedByName} updated "${taskName}" in "${stageName}": ${changeDescription}`,
      type: 'task',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: updatedById,
      skipUserId: updatedById,
      extra: {
        taskName,
        stageName,
        changes,
        action: 'task-updated'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'task-updated',
      details: {
        taskName,
        stageName,
        changes: changeDescription,
        updatedByName
      }
    })

    console.log('✅ Task update notifications sent')
  } catch (err) {
    console.error('❌ Failed to send task update notification:', err)
  }
}

/**
 * Notify when a task is deleted
 */
export async function notifyTaskDeleted({
  projectId,
  taskName,
  stageName,
  deletedById,
  deletedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) return

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `🗑️ Task Deleted - ${projectName}`,
      body: `${deletedByName} deleted task "${taskName}" from "${stageName}"`,
      type: 'task',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: deletedById,
      skipUserId: deletedById,
      extra: {
        taskName,
        stageName,
        action: 'task-deleted'
      }
    })

    // Send email
    await sendTimelineEmail({
      projectId,
      projectName,
      recipients: allRecipients,
      type: 'task-deleted',
      details: {
        taskName,
        stageName,
        deletedByName
      }
    })

    console.log('✅ Task deletion notifications sent')
  } catch (err) {
    console.error('❌ Failed to send task deletion notification:', err)
  }
}

/**
 * Helper function to send timeline-related emails
 */
async function sendTimelineEmail({ projectId, projectName, recipients, type, details }) {
  try {
    // Get recipient emails
    const emails = []
    for (const userRef of recipients) {
      if (userRef && userRef.id) {
        const userDoc = await getDoc(userRef)
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.email && !userData.disabled) {
            emails.push(userData.email)
          }
        }
      }
    }

    if (emails.length === 0) return

    let subject, message

    switch (type) {
      case 'stage-created':
        subject = `📋 New Stage Added - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">New Stage Added</h2>
            <p>${details.createdByName} has added a new stage to <strong>${projectName}</strong></p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Stage:</strong> ${details.stageName}</p>
              <p><strong>Due Date:</strong> ${details.dueDate}</p>
              <p><strong>Cost:</strong> ${details.cost}</p>
            </div>
          </div>
        `
        break

      case 'stage-updated':
        subject = `🔄 Stage Updated - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Stage Updated</h2>
            <p>${details.updatedByName} updated stage <strong>${details.stageName}</strong> in <strong>${projectName}</strong></p>
            <p><strong>Changes:</strong> ${details.changes}</p>
          </div>
        `
        break

      case 'stage-deleted':
        subject = `🗑️ Stage Deleted - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Stage Deleted</h2>
            <p>${details.deletedByName} deleted stage <strong>${details.stageName}</strong> from <strong>${projectName}</strong></p>
          </div>
        `
        break

      case 'task-created':
        subject = `✅ New Task Added - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">New Task Added</h2>
            <p>${details.createdByName} added a new task to <strong>${projectName}</strong></p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Task:</strong> ${details.taskName}</p>
              <p><strong>Stage:</strong> ${details.stageName}</p>
              <p><strong>Due Date:</strong> ${details.dueDate}</p>
              <p><strong>Cost:</strong> ${details.cost}</p>
            </div>
          </div>
        `
        break

      case 'task-updated':
        subject = `🔄 Task Updated - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f97316;">Task Updated</h2>
            <p>${details.updatedByName} updated task <strong>${details.taskName}</strong> in stage <strong>${details.stageName}</strong></p>
            <p><strong>Changes:</strong> ${details.changes}</p>
          </div>
        `
        break

      case 'task-deleted':
        subject = `🗑️ Task Deleted - ${projectName}`
        message = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Task Deleted</h2>
            <p>${details.deletedByName} deleted task <strong>${details.taskName}</strong> from stage <strong>${details.stageName}</strong></p>
          </div>
        `
        break

      default:
        return
    }

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emails,
        subject,
        message
      })
    })
  } catch (error) {
    console.error('Error sending timeline email:', error)
  }
}