'use client'
import { FaBell, FaBars } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import NotificationDropdown from '@/components/ui/NotificationDropdown'
import Image from 'next/image'

export default function Header({ onMenuClick }) {
  const { currentUser, loading: authLoading } = useAuth()
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser?.uid) {
        setLoading(false)
        return
      }

      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setAdminUser({
            displayName: userData.displayName || currentUser.email,
            email: currentUser.email,
            role: userData.role || 'admin',
            photoURL: userData.photoURL || null
          })
        } else {
          // Fallback to auth data if Firestore doc doesn't exist
          setAdminUser({
            displayName: currentUser.email,
            email: currentUser.email,
            role: 'admin',
            photoURL: null
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Fallback to auth data
        setAdminUser({
          displayName: currentUser.email,
          email: currentUser.email,
          role: 'admin',
          photoURL: null
        })
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchUserProfile()
    }
  }, [currentUser, authLoading])

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return 'AD'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Format role for display
  const formatRole = (role) => {
    if (!role) return 'Admin'
    return role
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading || authLoading) {
    return (
      <header className="bg-gray-100 h-fit border-b border-gray-300 px-4 md:px-8 w-full pb-4 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3"></div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <FaBell className="text-2xl text-gray-600" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-300 animate-pulse"></div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <FaBars className="text-2xl text-gray-700" />
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-gray-100 h-fit border-b border-gray-300 px-4 md:px-8 w-full pb-4 pt-5 flex items-center justify-between">
      {/* Left: Empty space for layout */}
      <div className="flex items-center gap-3"></div>
   
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <NotificationDropdown notificationsPageUrl="/admin/notifications" />

        {/* User Avatar + Info */}
        <div className="flex cursor-pointer items-center gap-3 hover:opacity-90 transition-opacity">
          {/* Avatar */}
          {adminUser?.photoURL ? (
            <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary">
              <Image
                src={adminUser.photoURL}
                alt={adminUser.displayName || 'Admin'}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {adminUser ? getInitials(adminUser.displayName) : 'AD'}
            </div>
          )}
          
          {/* User Info */}
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold text-gray-800 text-sm">
              {adminUser ? adminUser.displayName : 'Admin'}
            </span>
            <span className="text-xs text-gray-500">
              {adminUser ? formatRole(adminUser.role) : 'System Admin'}
            </span>
          </div>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-200 focus:outline-none transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>
      </div>
    </header>
  )
}