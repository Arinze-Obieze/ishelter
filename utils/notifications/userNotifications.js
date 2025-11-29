import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { notifyUsers } from './notifyUsers'

/**
 * Notify admins and affected user when a user's profile is updated
 */
export async function notifyUserUpdate({
  userId,
  updatedById,
  updatedByName,
  changes = [],
  previousData = {},
  newData = {}
}) {
  try {
    // Get all admins to notify
    const adminsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'admin')
    )
    const adminsSnap = await getDocs(adminsQuery)
    const adminRefs = adminsSnap.docs.map(doc => doc.ref)

    // Format changes for notification body
    const changesText = changes.length > 0 ? changes.join(' | ') : 'User information updated'

    await notifyUsers({
      userRefs: adminRefs,
      includeAdmins: false, // Already included in adminRefs
      title: `👤 User Profile Updated by ${updatedByName}`,
      body: changesText,
      type: 'user-update',
      relatedId: userId,
      actionUrl: `/admin/user-management`, // Adjust based on your routes
      senderId: updatedById,
      extra: {
        userId,
        updatedByName,
        previousData,
        newData,
        changes
      }
    })

    console.log('✅ User update notifications sent to admins')
  } catch (err) {
    console.error('❌ Failed to send user update notification:', err)
  }
}

/**
 * Notify admins when a new user signs up
 */
export async function notifyNewUserSignup({
  userId,
  userName,
  userEmail,
  userRole = 'client'
}) {
  try {
    // Get all admins to notify
    const adminsQuery = query(
      collection(db, 'users'),
      where('role', '==', 'admin')
    )
    const adminsSnap = await getDocs(adminsQuery)
    const adminRefs = adminsSnap.docs.map(doc => doc.ref)

    await notifyUsers({
      userRefs: adminRefs,
      includeAdmins: false,
      title: '🆕 New User Registration',
      body: `${userName} (${userEmail}) has signed up as ${userRole}`,
      type: 'user-signup',
      relatedId: userId,
      actionUrl: `/admin/user-management`,
      extra: {
        userId,
        userName,
        userEmail,
        userRole
      }
    })

    console.log('✅ New user signup notifications sent to admins')
  } catch (err) {
    console.error('❌ Failed to send user signup notification:', err)
  }
}
