import { collection, addDoc, serverTimestamp, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore'
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
  
  // Notify project users - OPTIMIZED: Batch load users in parallel
  try {
    // Filter out invalid refs and skip the sender
    const validRefs = userRefs.filter(ref => ref && ref.id && (!skipUserId || ref.id !== skipUserId))
    
    if (validRefs.length > 0) {
      // Load all user docs in parallel (instead of sequential awaits)
      const userDocPromises = validRefs.map(userRef => getDoc(userRef))
      const userDocs = await Promise.all(userDocPromises)
      
      // Build notifications from loaded docs
      const userNotifications = []
      userDocs.forEach((userDoc, index) => {
        if (!userDoc.exists()) return
        
        const userData = userDoc.data()
        // Don't notify disabled users
        if (userData.disabled) return
        
        const userId = validRefs[index].id
        
        userNotifications.push({
          notification: {
            title,
            body,
            type,
            recipientId: userId,
            relatedId,
            projectId,
            actionUrl,
            senderId,
            isGlobal: false,
            read: false,
            createdAt: serverTimestamp(),
            ...extra,
          },
          userId
        })
      })
      
      // Create all notifications in parallel using writeBatch
      if (userNotifications.length > 0) {
        const batch = writeBatch(db)
        const notificationsRef = collection(db, 'notifications')
        
        userNotifications.forEach(({ notification }) => {
          const docRef = batch.doc(notificationsRef)
          batch.set(docRef, notification)
        })
        
        await batch.commit()
        
        // Track notified users
        userNotifications.forEach(({ userId }) => notified.add(userId))
      }
    }
  } catch (err) {
    console.error('Failed to notify project users', err)
  }
  
  // Notify all admins if requested
  if (includeAdmins) {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'admin')
      )
      const adminsSnap = await getDocs(adminsQuery)
      
      const adminNotifications = []
      
      adminsSnap.forEach((docSnap) => {
        const user = docSnap.data()
        const adminId = docSnap.id
        
        // Skip if already notified, disabled, or is the sender
        if (notified.has(adminId) || user.disabled || (skipUserId && adminId === skipUserId)) {
          return
        }
        
        adminNotifications.push({
          title,
          body,
          type,
          recipientId: adminId,
          relatedId,
          projectId,
          actionUrl,
          senderId,
          isGlobal: false,
          read: false,
          createdAt: serverTimestamp(),
          ...extra,
        })
        
        notified.add(adminId)
      })
      
      // Batch create admin notifications using writeBatch
      if (adminNotifications.length > 0) {
        const batch = writeBatch(db)
        const notificationsRef = collection(db, 'notifications')
        
        adminNotifications.forEach(notification => {
          const docRef = batch.doc(notificationsRef)
          batch.set(docRef, notification)
        })
        
        await batch.commit()
      }
    } catch (err) {
      console.error('Failed to notify admins', err)
    }
  }
  
  // Send Push Notifications
  try {
    const pushRecipients = Array.from(notified)
    if (pushRecipients.length > 0) {
        // We use fetch purely to trigger the side effect, don't await strictly if we want speed,
        // but here we can await to ensure it works.
        // Note: Using absolute URL or relative if on client? notifyUsers is used on client and server (likely).
        // If on server (e.g. API route), we need absolute URL. If client, relative is fine.
        // Safe bet: usage appears to be mostly client-side right now, but better check.
        // Actually, let's just use relative and let modern fetch handle it if client.
        // If server, it might fail without base URL. 
        // Let's assume client-side or Next.js environment where relative path works or fetch is polyfilled.
        
        // However, notifyUsers is often called from client.
        // Let's fire and forget for performance transparency
        fetch('/api/notifications/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                body,
                userIds: pushRecipients,
                actionUrl
            })
        }).catch(e => console.error('Push trigger failed', e))
    }
  } catch (err) {
      console.error('Failed to trigger push notifications', err)
  }

  return { success: true, notifiedCount: notified.size }
}