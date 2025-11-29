/**
 * Centralized Notification System
 * 
 * This file exports all notification helper functions.
 * Import what you need:
 * 
 * import { notifyDocumentUpload, notifyPaymentStatusChange } from '@/utils/notifications'
 */

// Core notification utility
export { notifyUsers } from './notifyUsers'

// Document notifications
export {
  notifyDocumentUpload,
  notifyDocumentStatusChange,
  notifyDocumentActionRequired
} from './documentNotifications'

// Task & Timeline notifications
export {
  notifyPhaseCompletion,
  notifyTaskCompletion,
  notifyDeadlineApproaching,
  notifyTimelineUpdate
} from './taskNotifications'

// Payment & Invoice notifications
export {
  notifyPaymentStatusChange,
  notifyInvoiceDueSoon,
  notifyPaymentReceived
} from './paymentNotifications'

// Project Assignment notifications
export {
  notifyProjectManagerAssignment,
  notifyClientsOfNewPM,
  notifyUserAddedToProject,
  notifyConsultationBooked,
  notifyConsultationConfirmed
} from './projectAssignmentNotifications'

// User notifications
export {
  notifyUserUpdate,
  notifyNewUserSignup
} from './userNotifications'

/**
 * USAGE EXAMPLES:
 * 
 * 1. When a document is uploaded:
 * ```
 * import { notifyDocumentUpload } from '@/utils/notifications'
 * 
 * await notifyDocumentUpload({
 *   projectId: 'project123',
 *   documentName: 'Contract.pdf',
 *   documentType: 'pdf',
 *   uploaderId: currentUser.uid,
 *   uploaderName: currentUser.displayName,
 *   category: 'contracts'
 * })
 * ```
 * 
 * 2. When a phase is completed:
 * ```
 * import { notifyPhaseCompletion } from '@/utils/notifications'
 * 
 * await notifyPhaseCompletion({
 *   projectId: 'project123',
 *   phaseName: 'Foundation',
 *   completedById: currentUser.uid,
 *   completedByName: currentUser.displayName
 * })
 * ```
 * 
 * 3. When invoice status changes:
 * ```
 * import { notifyPaymentStatusChange } from '@/utils/notifications'
 * 
 * await notifyPaymentStatusChange({
 *   projectId: 'project123',
 *   invoiceNumber: 'INV-001',
 *   newStatus: 'paid',
 *   amount: 50000,
 *   paidById: currentUser.uid,
 *   paidByName: currentUser.displayName
 * })
 * ```
 * 
 * 4. When assigning a project manager:
 * ```
 * import { notifyProjectManagerAssignment, notifyClientsOfNewPM } from '@/utils/notifications'
 * 
 * // Notify the PM
 * await notifyProjectManagerAssignment({
 *   projectId: 'project123',
 *   projectManagerId: 'pm456',
 *   assignedById: currentUser.uid,
 *   assignedByName: currentUser.displayName
 * })
 * 
 * // Notify the clients
 * await notifyClientsOfNewPM({
 *   projectId: 'project123',
 *   projectManagerId: 'pm456',
 *   projectManagerName: 'John Manager',
 *   assignedById: currentUser.uid
 * })
 * ```
 */