"use client"

import { useState, useEffect } from "react"
import { FiUser, FiLock, FiShield } from "react-icons/fi"
import { useAuth } from "@/contexts/AuthContext"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import toast from "react-hot-toast"

import AdminSecuritySettings from "@/components/Admin/settings/Security/AdminSecuritySettings"
import AdminManagement from "@/components/Admin/settings/Security/AdminManagement"
import AdminProfileSettings from "@/components/Admin/settings/Profile/AdminProfileSettings"

export default function AdminSettingsPage() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [userProfile, setUserProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  
  const tabs = [
    { id: "profile", label: "Profile & Contact", icon: FiUser, mobileLabel: "Profile" },
    { id: "security", label: "Security", icon: FiLock, mobileLabel: "Security" },
    { id: "admins", label: "Admin Management", icon: FiShield, mobileLabel: "Admins" }, 
  ]

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser?.uid) return
      
      setLoadingProfile(true)
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserProfile({ uid: currentUser.uid, ...data })
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [currentUser])

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-0">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 border-b-2 transition-all text-sm font-medium
                    ${
                      activeTab === tab.id
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex gap-2 overflow-x-auto py-3 -mx-4 px-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex-shrink-0
                    ${activeTab === tab.id ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                  `}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.mobileLabel}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "profile" && (
          <AdminProfileSettings 
            currentUser={currentUser}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        )}

        {activeTab === "security" && <AdminSecuritySettings />}
        {activeTab === "admins" && <AdminManagement currentUserProfile={userProfile} />}
      </div>
    </div>
  )
}