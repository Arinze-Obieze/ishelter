"use client"

import { useState } from "react"
import { FiBell } from "react-icons/fi"

export default function NotificationPreferences() {
  const [notifications, setNotifications] = useState({
    emailInvoices: true,
    smsUpdates: true,
    inAppMessages: true,
    approvalRequests: true,
    marketing: false,
  })

  const toggleNotification = (key, disabled = false) => {
    if (disabled) return
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const notificationItems = [
    {
      key: "emailInvoices",
      label: "Email Alerts for New Invoices",
      desc: "Receive an email when a new invoice is generated",
      disabled: true,
    },
    {
      key: "approvalRequests",
      label: "Approval Request Notifications",
      desc: "Notifications when your approval is needed for project items",
      disabled: true,
    },
    {
      key: "marketing",
      label: "Marketing Communications",
      desc: "Updates about SHELTER services, news, and promotions",
      disabled: false,
    },
  ]

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <FiBell className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Choose how and when you want to be notified about updates to your projects.
      </p>

      <div className="space-y-4 mb-8">
        {notificationItems.map(({ key, label, desc, disabled }) => (
          <div
            key={key}
            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg transition ${
              disabled ? "bg-gray-50" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div>
              <p className="font-medium text-gray-900">{label}</p>
              <p className="text-sm text-gray-600">{desc}</p>
              {disabled && (
                <p className="text-xs text-gray-500 italic mt-1">
                  This notification cannot be disabled
                </p>
              )}
            </div>
            <label
              title={disabled ? "This setting is required" : ""}
              className={`flex items-center flex-shrink-0 ${
                disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={() => toggleNotification(key, disabled)}
                className="sr-only peer"
                disabled={disabled}
              />
              <div
                className={`relative w-11 h-6 rounded-full transition ${
                  notifications[key] ? "bg-primary" : "bg-gray-300"
                } ${disabled ? "opacity-80" : ""}`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${
                    notifications[key] ? "translate-x-5" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
          Reset to Default
        </button>
        <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition">
          Save Preferences
        </button>
      </div>
    </section>
  )
}
