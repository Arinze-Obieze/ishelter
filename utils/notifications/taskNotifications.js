import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'

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