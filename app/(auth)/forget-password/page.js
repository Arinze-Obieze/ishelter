"use client"

import { useState } from "react"
import { FiShield } from "react-icons/fi"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Reset link requested for:", email)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-800 tracking-wide">iSHELTER</h1>
          </div>

          {/* Orange accent line */}
          <div className="w-full h-1 bg-orange-500 mb-8"></div>

          {/* Form Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Forgot Your Password?</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter the email address you used to register. We'll send you a link to reset your password.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 outline-none"
            >
              Send Reset Link
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 flex items-start space-x-2">
            <FiShield className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
            <p className="text-xs text-gray-500">For your security, the reset link will expire after 30 minutes.</p>
          </div>
        </div>
      </div>

      {/* Back to Login */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Remembered your password?{" "}
          <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  )
}
