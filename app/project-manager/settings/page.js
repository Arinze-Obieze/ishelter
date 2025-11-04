"use client"

import SecuritySettings from "@/components/ProjectManager/Security/SecuritySettings"
import { useState } from "react"
import { FiUser, FiUsers, FiLock, FiBell, FiUpload } from "react-icons/fi"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [phoneNumber, setPhoneNumber] = useState("+1 (555) 123-4567")
  const [fullName, setFullName] = useState("Sarah Johnson")
  const [title, setTitle] = useState("Project Manager")
  const [phoneVisible, setPhoneVisible] = useState(true)
  
  const tabs = [
    { id: "profile", label: "Profile & Contact", icon: FiUser, mobileLabel: "Profile" },
    // { id: "team", label: "Team Communication", icon: FiUsers, mobileLabel: "Team" },
    { id: "security", label: "Security", icon: FiLock, mobileLabel: "Security" },
    // { id: "notifications", label: "Notifications", icon: FiBell, mobileLabel: "Alerts" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 sm:px-6 lg:px-8">
      
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
                        ? "border-orange-500 text-gray-900"
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

          {/* Mobile Navigation - Horizontal pill layout */}
          <div className="sm:hidden flex gap-2 overflow-x-auto py-3 -mx-4 px-4">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all flex-shrink-0
                    ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
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
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600 text-sm mb-6">Update your personal details and profile picture</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Picture and Upload */}
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                    <FiUser className="w-12 h-12 text-gray-400" />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiUpload className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Professional Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Professional Title / Role</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value="sarah.johnson@ishelter.com"
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-2">Email address cannot be changed</p>
                </div>
              </div>
            </div>

        
            {/* Save Changes Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Other Tabs */}
        {/* {activeTab === "team" && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-600">
            Team Communication settings coming soon
          </div>
        )} */}

        {activeTab === "security" && (
         <SecuritySettings  />
        )}

        {/* {activeTab === "notifications" && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-600">
            Notifications settings coming soon
          </div>
        )} */}
      </div>
    </div>
  )
}
