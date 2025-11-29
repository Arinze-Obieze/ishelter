'use client'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useNotifications } from '@/contexts/NotificationContext'

/**
 * Temporary debugging component to diagnose notification issues
 * Add this to your admin notifications page temporarily
 */
export default function NotificationDebugger() {
  const [debug, setDebug] = useState(null)
  const { currentUser, notifications } = useNotifications()

  useEffect(() => {
    const runDebug = async () => {
      if (!auth.currentUser) {
        setDebug({ error: 'No authenticated user' })
        return
      }

      const uid = auth.currentUser.uid
      
      try {
        // Check user document
        const userDocRef = await getDocs(query(collection(db, 'users'), where('__name__', '==', uid)))
        const userData = userDocRef.docs[0]?.data()

        // Count notifications by query type
        const q1 = await getDocs(query(collection(db, 'notifications'), where('recipientId', '==', uid)))
        const q2 = await getDocs(query(collection(db, 'notifications'), where('recipientIds', 'array-contains', uid)))
        const q3 = userData?.role ? await getDocs(query(collection(db, 'notifications'), where('roles', 'array-contains', userData.role))) : { docs: [] }
        const q4 = await getDocs(query(collection(db, 'notifications'), where('isGlobal', '==', true)))

        // Get all notifications to check structure
        const allNotifs = await getDocs(collection(db, 'notifications'))
        const notifSamples = allNotifs.docs.slice(0, 3).map(d => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate?.()?.toISOString() || 'no date'
        }))

        setDebug({
          authUid: uid,
          authEmail: auth.currentUser.email,
          userDocExists: !!userData,
          userRole: userData?.role || 'NO ROLE FOUND',
          contextUser: currentUser,
          notificationCounts: {
            recipientId: q1.docs.length,
            recipientIds: q2.docs.length,
            roles: q3.docs.length,
            isGlobal: q4.docs.length,
            total: allNotifs.docs.length,
            inContext: notifications.length,
          },
          sampleNotifications: notifSamples,
        })
      } catch (error) {
        setDebug({ error: error.message, stack: error.stack })
      }
    }

    runDebug()
  }, [currentUser, notifications])

  if (!debug) return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">Loading debug info...</div>

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-4 text-xs font-mono">
      <h3 className="font-bold text-sm mb-2">🔍 Notification Debug Info</h3>
      <pre className="whitespace-pre-wrap overflow-auto max-h-96">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  )
}