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
      setNotifications(arr)
      setLoading(false)
    }

    try {
      // Query 1: notifications targeted at a single recipientId
      const q1 = query(
        collection(db, 'notifications'),
        where('recipientId', '==', uid),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(onSnapshot(q1, addSnapshot))

      // Query 2: notifications with recipientIds array containing uid
      const q2 = query(
        collection(db, 'notifications'),
        where('recipientIds', 'array-contains', uid),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(onSnapshot(q2, addSnapshot))

      // Query 3: role-based notifications
      if (role) {
        const q3 = query(
          collection(db, 'notifications'),
          where('roles', 'array-contains', role),
          orderBy('createdAt', 'desc')
        )
        unsubscribes.push(onSnapshot(q3, addSnapshot))
      }

      // Query 4: global notifications
      const q4 = query(
        collection(db, 'notifications'),
        where('isGlobal', '==', true),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(onSnapshot(q4, addSnapshot))
    } catch (err) {
      console.error('Notifications subscription error:', err)
      setLoading(false)
    }

    return () => unsubscribes.forEach((u) => (typeof u === 'function' ? u() : u && u()))
  }, [currentUser])

  const createNotification = async (payload) => {
    try {
      const data = {
        title: payload.title || '',
        body: payload.body || payload.description || '',
        type: payload.type || 'generic',
        recipientId: payload.recipientId || null,
        recipientIds: payload.recipientIds || null,
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
