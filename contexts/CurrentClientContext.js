// contexts/CurrentClientContext.js
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const CurrentClientContext = createContext()

export const CurrentClientProvider = ({ children }) => {
  const [currentClient, setCurrentClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔄 Auth changed, subscribing to user:", user.uid)
        
        // Subscribe to the current user's document
        const userDocRef = doc(db, 'users', user.uid)
        const unsubscribeUser = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = {
                id: docSnap.id,
                ...docSnap.data()
              }
              console.log("✅ Current client data:", userData)
              setCurrentClient(userData)
              setError(null)
            } else {
              console.log("❌ User document doesn't exist")
              setCurrentClient(null)
            }
            setLoading(false)
          },
          (err) => {
            console.error("Error fetching current client:", err)
            setError(err.message)
            setLoading(false)
          }
        )

        return () => unsubscribeUser()
      } else {
        console.log("🚪 No user signed in")
        setCurrentClient(null)
        setLoading(false)
        setError(null)
      }
    })

    return () => unsubscribeAuth()
  }, [])

  const value = {
    currentClient,
    loading,
    error,
    // Aliases for backward compatibility
    user: currentClient,
    userData: currentClient
  }

  return (
    <CurrentClientContext.Provider value={value}>
      {children}
    </CurrentClientContext.Provider>
  )
}

export const useCurrentClient = () => {
  const context = useContext(CurrentClientContext)
  if (context === undefined) {
    throw new Error('useCurrentClient must be used within a CurrentClientProvider')
  }
  return context
}