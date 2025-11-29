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
  getDoc,
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen to auth state and fetch user data from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore to get role
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: userData.role || null,
              displayName: userData.displayName || userData.name || firebaseUser.email,
            })
          } else {
            // Fallback if user doc doesn't exist
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: null,
              displayName: firebaseUser.email,
            })
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          setCurrentUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: null,
            displayName: firebaseUser.email,
          })
        }
      } else {
        setCurrentUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Subscribe to notifications
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      setNotifications([])
      setLoading(false)
      return
    }

    const uid = currentUser.id
    const role = currentUser.role

    console.log('📬 Setting up notifications for:', { uid, role })

    const unsubscribes = []
    const received = new Map()

    const addSnapshot = (snap, queryName) => {
      console.log(`📨 ${queryName} returned ${snap.docs.length} notifications`)
      snap.docs.forEach((d) => {
        const data = d.data()
        received.set(d.id, { id: d.id, ...data })
      })
      
      // Convert map to array and sort by createdAt desc
      const arr = Array.from(received.values()).sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0)
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0)
        return tb - ta
      })
      
      console.log(`📊 Total unique notifications: ${arr.length}`)
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
      unsubscribes.push(
        onSnapshot(q1, 
          (snap) => addSnapshot(snap, 'recipientId query'),
          (error) => {
            console.error('Error in recipientId query:', error)
            setLoading(false)
          }
        )
      )

      // Query 2: notifications with recipientIds array containing uid
      const q2 = query(
        collection(db, 'notifications'),
        where('recipientIds', 'array-contains', uid),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(
        onSnapshot(q2, 
          (snap) => addSnapshot(snap, 'recipientIds array query'),
          (error) => {
            console.error('Error in recipientIds query:', error)
          }
        )
      )

      // Query 3: role-based notifications (if user has a role)
      if (role) {
        const q3 = query(
          collection(db, 'notifications'),
          where('roles', 'array-contains', role),
          orderBy('createdAt', 'desc')
        )
        unsubscribes.push(
          onSnapshot(q3, 
            (snap) => addSnapshot(snap, `roles query (${role})`),
            (error) => {
              console.error('Error in roles query:', error)
            }
          )
        )
      }

      // Query 4: global notifications
      const q4 = query(
        collection(db, 'notifications'),
        where('isGlobal', '==', true),
        orderBy('createdAt', 'desc')
      )
      unsubscribes.push(
        onSnapshot(q4, 
          (snap) => addSnapshot(snap, 'global notifications query'),
          (error) => {
            console.error('Error in global query:', error)
          }
        )
      )
    } catch (err) {
      console.error('❌ Notifications subscription error:', err)
      setLoading(false)
    }

    return () => {
      console.log('🔌 Unsubscribing from notifications')
      unsubscribes.forEach((u) => (typeof u === 'function' ? u() : u && u()))
    }
  }, [currentUser])

  // Deprecated: use notifyUsers utility instead for new notification creation
  const createNotification = async (payload) => {
    console.warn('createNotification is deprecated. Use notifyUsers utility instead.')
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
    currentUser, // Expose for debugging
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