'use client'
import React, { useState } from 'react'
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { auth } from '@/lib/firebase'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import toast from 'react-hot-toast'

const AdminSecuritySettings = ({ userProfile }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'text-red-500' }
    if (strength <= 3) return { strength, label: 'Fair', color: 'text-yellow-500' }
    if (strength <= 4) return { strength, label: 'Good', color: 'text-blue-500' }
    return { strength, label: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  // Send email notification
  const sendEmailNotification = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userProfile?.email || auth.currentUser?.email,
          subject: 'Security Alert: Admin Password Changed',
          name: userProfile?.displayName || 'Admin',
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">Admin Password Successfully Changed</h2>
              <p>Hello ${userProfile?.displayName || 'Admin'},</p>
              <p>Your admin account password was successfully changed on <strong>${new Date().toLocaleString()}</strong>.</p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <p style="margin: 5px 0 0 0;">If you did not make this change, please contact support immediately as this is an admin account.</p>
              </div>
              <p>For your security:</p>
              <ul>
                <li>Never share your admin password with anyone</li>
                <li>Use a unique password for this account</li>
                <li>Consider using a password manager</li>
              </ul>
              <p>Best regards,<br/>iShelter Security Team</p>
            </div>
          `
        })
      })

      if (!response.ok) {
        console.error('Failed to send email notification')
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  // Validate password requirements
  const validatePassword = () => {
    if (!currentPassword) {
      toast.error('Please enter your current password')
      return false
    }

    if (!newPassword) {
      toast.error('Please enter a new password')
      return false
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return false
    }

    if (newPassword === currentPassword) {
      toast.error('New password must be different from current password')
      return false
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    return true
  }

  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (!validatePassword()) return

    setIsLoading(true)

    try {
      const user = auth.currentUser

      if (!user || !user.email) {
        toast.error('No authenticated user found. Please log in again.')
        setIsLoading(false)
        return
      }

      // Step 1: Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      
      try {
        await reauthenticateWithCredential(user, credential)
      } catch (error) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          toast.error('Current password is incorrect')
        } else {
          toast.error('Authentication failed. Please try again.')
        }
        setIsLoading(false)
        return
      }

      // Step 2: Update password
      await updatePassword(user, newPassword)

      // Step 3: Send email notification (don't wait for it)
      sendEmailNotification()

      // Step 4: Clear form and show success
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Admin password updated successfully!')

    } catch (error) {
      console.error('Password update error:', error)
      
      if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.')
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('For security, please log out and log back in before changing your password.')
      } else {
        toast.error('Failed to update password. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Change Password Section */}
      <div className="bg-white rounded-lg md:p-6 border border-gray-200 p-2">
        <div className="flex items-start gap-3 mb-4">
          <FiLock className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Change Admin Password</h3>
            <p className="text-gray-600 text-sm">Update your admin password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 p-2">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        passwordStrength.strength <= 2 ? 'bg-red-500' :
                        passwordStrength.strength <= 3 ? 'bg-yellow-500' :
                        passwordStrength.strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Use 8+ characters with a mix of letters, numbers & symbols
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={isLoading}
                className="w-full px-4 py-2 pr-10 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3">Admin Password Security Tips</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Use a unique password that you don't use anywhere else</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Make it at least 8 characters long with letters, numbers, and symbols</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Avoid using personal information like birthdays or names</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Consider using a password manager to generate and store passwords</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Never share your admin password with anyone</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default AdminSecuritySettings