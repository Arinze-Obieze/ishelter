"use client"

import { FiTrash2, FiAlertTriangle } from "react-icons/fi"

export default function DeleteAccount() {
  const deleteInfo = [
    "Once you delete your account, there is no going back. Please be certain.",
    "All your personal data will be permanently deleted from our systems.",
    "You'll lose access to all projects and associated data.",
    "Your profile information will be removed from all public listings.",
    "This action cannot be undone."
  ]

  return (
    <section className="bg-white rounded-lg shadow-sm border border-red-200 p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <FiTrash2 className="w-6 h-6 text-red-500" />
        <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex gap-3 mb-4">
          <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-3">Permanently Delete Your Account</h3>
            <ul className="space-y-2 text-sm text-red-800 mb-4">
              {deleteInfo.map((info, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}