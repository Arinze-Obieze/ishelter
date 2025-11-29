import { collection, addDoc, serverTimestamp, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Sends notifications to a list of userRefs and/or all admins.
 * @param {Object} options
 * @param {Array} options.userRefs - Array of DocumentReferences to users (e.g., projectUsers)
 * @param {boolean} options.includeAdmins - Whether to notify all admins
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body
 * @param {string} options.type - Notification type (e.g., 'invoice', 'update', 'document', 'task', 'payment')
 * @param {string} [options.relatedId] - Related entity id (e.g., invoice id)
 * @param {string} [options.projectId] - Project id
 * @param {string} [options.actionUrl] - URL to open on click
 * @param {string} [options.senderId] - UID of sender
 * @param {Object} [options.extra] - Any extra fields to add
 * @param {string} [options.skipUserId] - UID to skip (e.g., creator)
 */
export async function notifyUsers({
  userRefs = [],
  includeAdmins = false,
  title,
  body,
  type,
  relatedId = null,
  projectId = null,
  actionUrl = null,
  senderId = null,
  extra = {},
  skipUserId = null,
}) {
  const notified = new Set()
  
  console.log('📧 Creating notifications:', { 
    title, 
    type, 
    userRefsCount: userRefs.length, 
    includeAdmins,
    skipUserId 
  })

  // Notify project users
  for (const userRef of userRefs) {
    if (!userRef || !userRef.id) {
      console.warn('⚠️ Invalid userRef:', userRef)
      continue
    }
    if (skipUserId && userRef.id === skipUserId) {
      console.log('⏭️ Skipping user:', userRef.id)
      continue
    }
    try {
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        console.warn('⚠️ User document not found:', userRef.id)
        continue
      }
      const userData = userDoc.data()
      if (userData.disabled) {
        console.log('⏭️ Skipping disabled user:', userRef.id)
        continue
      }
      const notification = {
        title,
        body,
        type,
        recipientIds: [userRef.id],
        relatedId,
        projectId,
        actionUrl,
        senderId,
        isGlobal: false,
        read: false,
        createdAt: serverTimestamp(),
        ...extra,
      }
      await addDoc(collection(db, 'notifications'), notification)
      notified.add(userRef.id)
      console.log('✅ Notified user:', userRef.id, userData.email || userData.name)
    } catch (err) {
      console.error('❌ Failed to notify user', userRef.id, err)
    }
  }

  // Notify all admins if requested
  if (includeAdmins) {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin')
      )
      const adminsSnap = await getDocs(adminsQuery)
      console.log('👑 Found admins:', adminsSnap.size)
      for (const docSnap of adminsSnap.docs) {
        const adminId = docSnap.id
        const adminData = docSnap.data()
        if (notified.has(adminId) || (skipUserId && adminId === skipUserId)) {
          console.log('⏭️ Skipping admin (already notified or is sender):', adminId)
          continue
        }
        if (adminData.disabled) {
          console.log('⏭️ Skipping disabled admin:', adminId)
          continue
        }
        const notification = {
          title,
          body,
          type,
          recipientIds: [adminId],
          relatedId,
          projectId,
          actionUrl,
          senderId,
          isGlobal: false,
          read: false,
          createdAt: serverTimestamp(),
          ...extra,
        }
        try {
          await addDoc(collection(db, 'notifications'), notification)
          notified.add(adminId)
          console.log('✅ Notified admin:', adminId, adminData.email || adminData.name)
        } catch (err) {
          console.error('❌ Failed to notify admin', adminId, err)
        }
      }
    } catch (err) {
      console.error('❌ Failed to fetch/notify admins', err)
    }
  }
  
  console.log('📧 Notification batch complete. Total notified:', notified.size)
  return { success: true, notifiedCount: notified.size, notifiedUsers: Array.from(notified) }
}