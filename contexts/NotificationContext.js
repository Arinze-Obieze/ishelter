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
  limit,
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

  const [limitCount, setLimitCount] = useState(20)

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
    
    // Track which queries have initialized
    const initializedDefaults = {
      q1: false, // recipientId
      q2: false, // recipientIds
      q3: role ? false : true, // roles (if no role, treat as initialized)
      q4: false, // global
    }
    
    // We need a mutable reference to track initialization across callbacks without triggering re-renders
    let initialized = { ...initializedDefaults }

    const updateNotifications = () => {
      // Convert map to array and sort by createdAt desc
      const arr = Array.from(received.values()).sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0)
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0)
        return tb - ta
      })
      
      setNotifications(arr)
      
      // Check if all queries are initialized
      if (Object.values(initialized).every(v => v)) {
        setLoading(false)
      }
    }

    const addSnapshot = (snap, queryKey) => {
      // Mark this query as initialized
      initialized[queryKey] = true
      
      // Update local cache
      snap.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          received.delete(change.doc.id)
        } else {
          received.set(change.doc.id, { id: change.doc.id, ...change.doc.data() })
        }
      })
      
      updateNotifications()
    }

    try {
      // Query 1: notifications targeted at a single recipientId
      const q1 = query(
        collection(db, 'notifications'),
        where('recipientId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      unsubscribes.push(
        onSnapshot(q1, 
          (snap) => addSnapshot(snap, 'q1'),
          (error) => {
            console.error('Error in recipientId query:', error)
            initialized['q1'] = true; updateNotifications();
          }
        )
      )

      // Query 2: notifications with recipientIds array containing uid
      const q2 = query(
        collection(db, 'notifications'),
        where('recipientIds', 'array-contains', uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      unsubscribes.push(
        onSnapshot(q2, 
          (snap) => addSnapshot(snap, 'q2'),
          (error) => {
            console.error('Error in recipientIds query:', error)
            initialized['q2'] = true; updateNotifications();
          }
        )
      )

      // Query 3: role-based notifications (if user has a role)
      if (role) {
        const q3 = query(
          collection(db, 'notifications'),
          where('roles', 'array-contains', role),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
        unsubscribes.push(
          onSnapshot(q3, 
            (snap) => addSnapshot(snap, 'q3'),
            (error) => {
              console.error('Error in roles query:', error)
              initialized['q3'] = true; updateNotifications();
            }
          )
        )
      }

      // Query 4: global notifications
      const q4 = query(
        collection(db, 'notifications'),
        where('isGlobal', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      unsubscribes.push(
        onSnapshot(q4, 
          (snap) => addSnapshot(snap, 'q4'),
          (error) => {
            console.error('Error in global query:', error)
            initialized['q4'] = true; updateNotifications();
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
  }, [currentUser, limitCount])

  const loadMore = () => {
    setLimitCount(prev => prev + 20)
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
      if (unreadNotifications.length === 0) return

      // Batched writes (limit 500 per batch)
      const batchSize = 500
      const chunks = []
      
      for (let i = 0; i < unreadNotifications.length; i += batchSize) {
        chunks.push(unreadNotifications.slice(i, i + batchSize))
      }

      const { writeBatch } = await import('firebase/firestore')
      
      await Promise.all(chunks.map(async (chunk) => {
        const batch = writeBatch(db)
        chunk.forEach((notification) => {
          const notificationRef = doc(db, 'notifications', notification.id)
          batch.update(notificationRef, { read: true })
        })
        await batch.commit()
      }))
      
      console.log(`✅ Marked ${unreadNotifications.length} notifications as read`)
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const hasMore = notifications.length >= limitCount

  const value = {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    currentUser,
    loadMore,
    hasMore
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