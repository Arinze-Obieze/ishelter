"use client"

import SecuritySection from "@/components/Dashboard/ProfileSettings/SecuritySection"
import TwoFactorAuth from "@/components/Dashboard/ProfileSettings/TwoFactorAuth"
import NotificationPreferences from "@/components/Dashboard/ProfileSettings/NotificationPreferences"
import DeleteAccount from "@/components/Dashboard/ProfileSettings/DeleteAccount"
import ProfileInformation from "@/components/Dashboard/ProfileSettings/ProfileInformation"

export default function AccountSettings() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileInformation />
        <SecuritySection />
        <TwoFactorAuth />
        <NotificationPreferences />
        <DeleteAccount />
      </div>
    </div>
  )
}