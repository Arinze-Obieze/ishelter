'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUsers } from './UserContext'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useUsers()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setNotifications([])
      setLoading(false)
      return
    }

    const uid = currentUser.id
    const role = currentUser.role || currentUser?.roles || null

    console.log('🔔 NotificationContext setup:', { uid, role, currentUser })

    const unsubscribes = []
    const received = new Map()

    const addSnapshot = (snap) => {
      snap.docs.forEach((d) => {
        received.set(d.id, { id: d.id, ...d.data() })
      })
      // convert map -> array and sort by createdAt desc
      const arr = Array.from(received.values()).sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0)
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0)
        return tb - ta
      })
      console.log('✅ Received notifications:', arr.length, arr.map(n => ({ id: n.id, title: n.title })))
      setNotifications(arr)
      setLoading(false)
    }

    const errorHandler = (err) => {
      console.warn('Notification query error:', err.code, err.message)
      setLoading(false)
    }

    try {
      // Query 1: notifications with recipientIds array containing uid
      const q1 = query(
        collection(db, 'notifications'),
        where('recipientIds', 'array-contains', uid),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(onSnapshot(q1, addSnapshot, errorHandler))

      // Query 2: role-based notifications
      if (role) {
        const q2 = query(
          collection(db, 'notifications'),
          where('roles', 'array-contains', role),
          orderBy('createdAt', 'desc')
        )
        unsubscribes.push(onSnapshot(q2, addSnapshot, errorHandler))
      }

      // Query 3: global notifications
      const q3 = query(
        collection(db, 'notifications'),
        where('isGlobal', '==', true),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(onSnapshot(q3, addSnapshot, errorHandler))

      setLoading(false)
    } catch (err) {
      console.error('Notifications subscription error:', err)
      setLoading(false)
    }

    return () => unsubscribes.forEach((u) => (typeof u === 'function' ? u() : u && u()))

    return () => unsubscribes.forEach((u) => (typeof u === 'function' ? u() : u && u()))
  }, [currentUser])

  // Deprecated: use notifyUsers utility instead for new notification creation
  const createNotification = async (payload) => {
    console.warn('createNotification is deprecated. Use notifyUsers utility instead.')
    try {
      const data = {
        title: payload.title || '',
        body: payload.body || payload.description || '',
        type: payload.type || 'generic',
        recipientIds: payload.recipientIds || [],
        roles: payload.roles || null,
        relatedId: payload.relatedId || null,
        projectId: payload.projectId || null,
        actionUrl: payload.actionUrl || null,
        senderId: payload.senderId || null,
        isGlobal: payload.isGlobal || false,
        read: false,
        createdAt: serverTimestamp(),
      }
      const ref = await addDoc(collection(db, 'notifications'), data)
      return { id: ref.id }
    } catch (err) {
      console.error('Failed to create notification:', err)
      throw err
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await updateDoc(notificationRef, { read: true })
    } catch (err) {
      console.error('Failed to mark notification read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read)
      for (const notification of unreadNotifications) {
        const notificationRef = doc(db, 'notifications', notification.id)
        await updateDoc(notificationRef, { read: true })
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = {
    notifications,
    loading,
    unreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
