"use client"

import { FiShield } from "react-icons/fi"

export default function TwoFactorAuth() {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <FiShield className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Add an extra layer of security to your account by enabling two-factor authentication.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
          <p className="text-sm text-gray-600">Require a verification code when logging in</p>
        </div>
        <label className="flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
        </label>
      </div>
    </section>
  )
}