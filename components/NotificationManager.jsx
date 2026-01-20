'use client'

import { useEffect } from 'react'
import { messaging } from '@/lib/firebase'
import { getToken, onMessage } from 'firebase/messaging'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function NotificationManager() {
  const { user } = useAuth()

  useEffect(() => {
    if (typeof window === 'undefined' || !messaging || !user) return

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          // Get Token
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
          })

          if (currentToken) {
            console.log('🔔 FCM Token:', currentToken)
            // Save token to user profile
            await setDoc(doc(db, 'users', user.uid), {
              fcmToken: currentToken
            }, { merge: true })
          } else {
            console.warn('No registration token available. Request permission to generate one.')
          }
        }
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err)
      }
    }

    requestPermission()

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('🔔 Message received in foreground:', payload)
      toast(payload.notification.title + ': ' + payload.notification.body, {
        icon: '🔔',
        duration: 5000,
        position: 'top-right'
      })
    })

    return () => {
      unsubscribe()
    }
  }, [user])

  return null // This component is invisible
}
