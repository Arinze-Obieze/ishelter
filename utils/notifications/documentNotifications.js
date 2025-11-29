import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'

/**
 * Notify users when a document is uploaded to a project
 */
export async function notifyDocumentUpload({
  projectId,
  documentName,
  documentType,
  uploaderId,
  uploaderName,
  category
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for document notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    
    // Format category for display
    const formattedCategory = category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : 'Document'

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `New ${formattedCategory} Uploaded - ${projectName}`,
      body: `${uploaderName} uploaded "${documentName}"`,
      type: 'document',
      projectId: projectId,
      actionUrl: `/dashboard/documents/${projectId}`,
      senderId: uploaderId,
      skipUserId: uploaderId,
      extra: {
        documentName,
        documentType,
        category,
        action: 'upload'
      }
    })

    console.log('✅ Document upload notifications sent')
  } catch (err) {
    console.error('❌ Failed to send document upload notification:', err)
  }
}

/**
 * Notify users when a document status changes (approved/rejected/pending)
 */
export async function notifyDocumentStatusChange({
  projectId,
  documentName,
  newStatus,
  reviewerId,
  reviewerName,
  comments
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for document status notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    // Create status-specific message
    const statusMessages = {
      approved: '✅ approved',
      rejected: '❌ rejected',
      pending: '⏳ marked as pending review for',
      'Pending Approval': '📋 submitted for approval'
    }

    const statusAction = statusMessages[newStatus] || `updated status for`
    const bodyText = comments 
      ? `${reviewerName} ${statusAction} "${documentName}". Comment: ${comments}`
      : `${reviewerName} ${statusAction} "${documentName}"`

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `Document ${newStatus} - ${projectName}`,
      body: bodyText,
      type: 'document',
      projectId: projectId,
      actionUrl: `/dashboard/documents/${projectId}`,
      senderId: reviewerId,
      skipUserId: reviewerId,
      extra: {
        documentName,
        status: newStatus,
        action: 'status-change',
        comments
      }
    })

    console.log('✅ Document status change notifications sent')
  } catch (err) {
    console.error('❌ Failed to send document status notification:', err)
  }
}

/**
 * Notify users when documents require action (approval, review, etc.)
 */
export async function notifyDocumentActionRequired({
  projectId,
  documentName,
  actionType, // 'approval', 'review', 'signature', etc.
  requesterId,
  requesterName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for document action notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    const actionMessages = {
      approval: 'requires your approval',
      review: 'needs your review',
      signature: 'needs your signature',
      revision: 'has been revised and needs re-review'
    }

    const actionMessage = actionMessages[actionType] || 'requires your attention'

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `Action Required: ${documentName}`,
      body: `"${documentName}" ${actionMessage} for ${projectName}`,
      type: 'action-required',
      projectId: projectId,
      actionUrl: `/dashboard/documents/${projectId}`,
      senderId: requesterId,
      skipUserId: requesterId,
      extra: {
        documentName,
        actionType,
        requesterName
      }
    })

    console.log('✅ Document action required notifications sent')
  } catch (err) {
    console.error('❌ Failed to send document action notification:', err)
  }
}