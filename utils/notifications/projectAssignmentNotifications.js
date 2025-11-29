import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'

/**
 * Notify project manager when assigned to a project
 */
export async function notifyProjectManagerAssignment({
  projectId,
  projectManagerId,
  assignedById,
  assignedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for PM assignment notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const projectType = projectData?.projectType || 'construction'
    const startDate = projectData?.startDate 
      ? new Date(projectData.startDate).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      : 'Not set'

    // Create notification for the project manager
    const pmRef = doc(db, 'users', projectManagerId)

    await notifyUsers({
      userRefs: [pmRef],
      includeAdmins: false,
      title: `🎯 You've Been Assigned to ${projectName}`,
      body: `${assignedByName} assigned you as project manager for ${projectName} (${projectType}). Start date: ${startDate}`,
      type: 'project-assignment',
      projectId: projectId,
      actionUrl: `/project-manager/project-details/${projectId}`,
      senderId: assignedById,
      extra: {
        projectName,
        projectType,
        startDate,
        action: 'pm-assignment',
        assignedByName
      }
    })

    console.log('✅ PM assignment notification sent')
  } catch (err) {
    console.error('❌ Failed to send PM assignment notification:', err)
  }
}

/**
 * Notify project users when a new project manager is assigned
 */
export async function notifyClientsOfNewPM({
  projectId,
  projectManagerId,
  projectManagerName,
  assignedById
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for new PM notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `New Project Manager - ${projectName}`,
      body: `${projectManagerName} has been assigned as your project manager for ${projectName}. They will be your main point of contact.`,
      type: 'project-update',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: assignedById,
      skipUserId: projectManagerId, // PM already got their own notification
      extra: {
        projectManagerName,
        projectManagerId,
        action: 'new-pm-assigned'
      }
    })

    console.log('✅ New PM notifications sent to clients')
  } catch (err) {
    console.error('❌ Failed to send new PM notification to clients:', err)
  }
}

/**
 * Notify when a new user is added to a project
 */
export async function notifyUserAddedToProject({
  projectId,
  newUserId,
  newUserName,
  addedById,
  addedByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for user addition notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const projectType = projectData?.projectType || 'construction'

    // Notify the new user
    const newUserRef = doc(db, 'users', newUserId)
    await notifyUsers({
      userRefs: [newUserRef],
      includeAdmins: false,
      title: `Welcome to ${projectName}! 🎉`,
      body: `${addedByName} has added you to ${projectName} (${projectType}). You can now access all project details and updates.`,
      type: 'project-assignment',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: addedById,
      extra: {
        projectName,
        projectType,
        action: 'user-added-to-project',
        addedByName
      }
    })

    // Notify existing project users about the new member
    const existingRecipients = (projectData?.projectUsers || []).filter(
      ref => ref.id !== newUserId
    )

    if (existingRecipients.length > 0) {
      await notifyUsers({
        userRefs: existingRecipients,
        includeAdmins: true,
        title: `New Team Member - ${projectName}`,
        body: `${newUserName} has joined ${projectName}`,
        type: 'project-update',
        projectId: projectId,
        actionUrl: `/dashboard/project-details/${projectId}`,
        senderId: addedById,
        skipUserId: addedById,
        extra: {
          newUserName,
          action: 'new-member-joined'
        }
      })
    }

    console.log('✅ User addition notifications sent')
  } catch (err) {
    console.error('❌ Failed to send user addition notification:', err)
  }
}

/**
 * Notify when a consultation is booked
 */
export async function notifyConsultationBooked({
  clientId,
  clientName,
  clientEmail,
  consultationType,
  consultationDate,
  consultationTime,
  additionalInfo
}) {
  try {
    // Notify all admins about the new consultation
    await notifyUsers({
      userRefs: [],
      includeAdmins: true,
      title: `📅 New Consultation Booked`,
      body: `${clientName} (${clientEmail}) booked a ${consultationType} consultation for ${consultationDate} at ${consultationTime}`,
      type: 'consultation',
      actionUrl: `/admin/consultations`,
      senderId: clientId,
      extra: {
        clientName,
        clientEmail,
        consultationType,
        consultationDate,
        consultationTime,
        additionalInfo,
        action: 'consultation-booked'
      }
    })

    console.log('✅ Consultation booking notifications sent to admins')
  } catch (err) {
    console.error('❌ Failed to send consultation notification:', err)
  }
}

/**
 * Notify client when their consultation is confirmed
 */
export async function notifyConsultationConfirmed({
  clientId,
  consultationType,
  consultationDate,
  consultationTime,
  meetingLink,
  confirmedById,
  confirmedByName
}) {
  try {
    const clientRef = doc(db, 'users', clientId)

    const bodyText = meetingLink
      ? `Your ${consultationType} consultation on ${consultationDate} at ${consultationTime} has been confirmed. Meeting link: ${meetingLink}`
      : `Your ${consultationType} consultation on ${consultationDate} at ${consultationTime} has been confirmed. We'll send you the meeting details soon.`

    await notifyUsers({
      userRefs: [clientRef],
      includeAdmins: false,
      title: `✅ Consultation Confirmed`,
      body: bodyText,
      type: 'consultation',
      actionUrl: `/dashboard`,
      senderId: confirmedById,
      extra: {
        consultationType,
        consultationDate,
        consultationTime,
        meetingLink,
        confirmedByName,
        action: 'consultation-confirmed'
      }
    })

    console.log('✅ Consultation confirmation sent to client')
  } catch (err) {
    console.error('❌ Failed to send consultation confirmation:', err)
  }
}