import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'

/**
 * Notify users when an invoice payment status changes
 */
export async function notifyPaymentStatusChange({
  projectId,
  invoiceNumber,
  newStatus, // 'paid', 'pending', 'overdue', 'cancelled'
  amount,
  paidById,
  paidByName
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for payment status notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []
    const projectManager = projectData?.projectManager || null

    // Include project manager for payment notifications
    const allRecipients = projectManager ? [...recipients, projectManager] : recipients

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)

    const statusMessages = {
      paid: {
        emoji: '✅',
        title: 'Payment Received',
        body: `Payment of ${formattedAmount} received for invoice ${invoiceNumber}. Thank you!`
      },
      pending: {
        emoji: '⏳',
        title: 'Payment Pending',
        body: `Invoice ${invoiceNumber} (${formattedAmount}) is awaiting payment confirmation`
      },
      overdue: {
        emoji: '🚨',
        title: 'Payment Overdue',
        body: `Invoice ${invoiceNumber} (${formattedAmount}) is now overdue. Please make payment as soon as possible.`
      },
      cancelled: {
        emoji: '❌',
        title: 'Invoice Cancelled',
        body: `Invoice ${invoiceNumber} has been cancelled`
      }
    }

    const statusInfo = statusMessages[newStatus] || {
      emoji: '📄',
      title: 'Payment Status Updated',
      body: `Invoice ${invoiceNumber} status changed to ${newStatus}`
    }

    await notifyUsers({
      userRefs: allRecipients,
      includeAdmins: true,
      title: `${statusInfo.emoji} ${statusInfo.title} - ${projectName}`,
      body: statusInfo.body,
      type: 'payment',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      senderId: paidById,
      extra: {
        invoiceNumber,
        amount,
        newStatus,
        action: 'payment-status-change',
        paidByName
      }
    })

    console.log('✅ Payment status change notifications sent')
  } catch (err) {
    console.error('❌ Failed to send payment status notification:', err)
  }
}

/**
 * Notify users when an invoice is about to become overdue
 */
export async function notifyInvoiceDueSoon({
  projectId,
  invoiceNumber,
  amount,
  dueDate,
  daysUntilDue
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for invoice due notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const recipients = projectData?.projectUsers || []

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)

    const urgencyEmoji = daysUntilDue <= 1 ? '🚨' : daysUntilDue <= 3 ? '⚠️' : '📅'
    const timeMessage = daysUntilDue === 0 
      ? 'due today' 
      : daysUntilDue === 1 
        ? 'due tomorrow' 
        : `due in ${daysUntilDue} days`

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `${urgencyEmoji} Invoice Due Soon - ${projectName}`,
      body: `Invoice ${invoiceNumber} (${formattedAmount}) is ${timeMessage}. Please make payment to avoid late fees.`,
      type: 'payment',
      projectId: projectId,
      actionUrl: `/dashboard/project-details/${projectId}`,
      extra: {
        invoiceNumber,
        amount,
        dueDate,
        daysUntilDue,
        action: 'invoice-due-reminder'
      }
    })

    console.log('✅ Invoice due soon notifications sent')
  } catch (err) {
    console.error('❌ Failed to send invoice due notification:', err)
  }
}

/**
 * Notify admins and project manager when payment is received
 */
export async function notifyPaymentReceived({
  projectId,
  invoiceNumber,
  amount,
  paymentMethod,
  paidById,
  paidByName,
  transactionRef
}) {
  try {
    const projectDoc = await getDoc(doc(db, 'projects', projectId))
    if (!projectDoc.exists()) {
      console.error('Project not found for payment received notification')
      return
    }

    const projectData = projectDoc.data()
    const projectName = projectData?.projectName || 'Project'
    const projectManager = projectData?.projectManager || null

    // Only notify project manager and admins about payment receipts
    const recipients = projectManager ? [projectManager] : []

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)

    const bodyText = transactionRef
      ? `${paidByName} paid ${formattedAmount} for invoice ${invoiceNumber} via ${paymentMethod}. Ref: ${transactionRef}`
      : `${paidByName} paid ${formattedAmount} for invoice ${invoiceNumber} via ${paymentMethod}`

    await notifyUsers({
      userRefs: recipients,
      includeAdmins: true,
      title: `💰 Payment Received - ${projectName}`,
      body: bodyText,
      type: 'payment',
      projectId: projectId,
      actionUrl: `/project-manager/project-details/${projectId}`,
      senderId: paidById,
      extra: {
        invoiceNumber,
        amount,
        paymentMethod,
        transactionRef,
        action: 'payment-received',
        paidByName
      }
    })

    console.log('✅ Payment received notifications sent to admins/PM')
  } catch (err) {
    console.error('❌ Failed to send payment received notification:', err)
  }
}