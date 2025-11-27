import { collection, addDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Sends notifications to a list of userRefs and/or all admins.
 * @param {Object} options
 * @param {Array} options.userRefs - Array of DocumentReferences to users (e.g., projectUsers)
 * @param {boolean} options.includeAdmins - Whether to notify all admins
 * @param {string} options.title - Notification title
 * @param {string} options.body - Notification body
 * @param {string} options.type - Notification type (e.g., 'invoice', 'update')
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
  // Notify project users
  for (const userRef of userRefs) {
    if (!userRef || !userRef.id) continue
    if (skipUserId && userRef.id === skipUserId) continue
    try {
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) continue
      const userData = userDoc.data()
      // Don't notify disabled users
      if (userData.disabled) continue
      const notification = {
        title,
        body,
        type,
        recipientId: userRef.id,
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
    } catch (err) {
      console.error('Failed to notify user', userRef.id, err)
    }
  }
  // Notify all admins if requested
  if (includeAdmins) {
    try {
      const adminsSnap = await getDoc(collection(db, 'users'))
      if (adminsSnap && adminsSnap.forEach) {
        adminsSnap.forEach(async (docSnap) => {
          const user = docSnap.data()
          if (user.role === 'admin' && (!skipUserId || docSnap.id !== skipUserId) && !notified.has(docSnap.id)) {
            const notification = {
              title,
              body,
              type,
              recipientId: docSnap.id,
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
            } catch (err) {
              console.error('Failed to notify admin', docSnap.id, err)
            }
          }
        })
      }
    } catch (err) {
      console.error('Failed to notify admins', err)
    }
  }
}
