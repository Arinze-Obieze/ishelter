"use client"

import { useState } from "react"
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi"
import { auth } from '@/lib/firebase'
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { toast } from 'react-hot-toast'
import { useCurrentClient } from '@/contexts/CurrentClientContext'

export default function SecuritySection() {
  const { currentClient } = useCurrentClient()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const [errors, setErrors] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleInputChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const validatePasswords = () => {
    const newErrors = {
      current: '',
      new: '',
      confirm: ''
    }

    let isValid = true

    // Check if current password is entered
    if (!passwords.current.trim()) {
      newErrors.current = 'Current password is required'
      isValid = false
    }

    // Check if new password is entered
    if (!passwords.new.trim()) {
      newErrors.new = 'New password is required'
      isValid = false
    } else if (passwords.new.length < 6) {
      newErrors.new = 'Password must be at least 6 characters'
      isValid = false
    }

    // Check if passwords match
    if (!passwords.confirm.trim()) {
      newErrors.confirm = 'Please confirm your new password'
      isValid = false
    } else if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match'
      isValid = false
    }

    // Check if new password is different from current
    if (passwords.current === passwords.new && passwords.new.trim()) {
      newErrors.new = 'New password must be different from current password'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const reauthenticateUser = async (password) => {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('No user logged in')
    }

    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
  }

  const sendPasswordChangeEmail = async () => {
    try {
      const user = auth.currentUser
      if (!user) return false

      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">Password Changed Successfully</h2>
          <p>Hello <strong>${currentClient?.displayName || 'User'}</strong>,</p>
          <p>Your password has been successfully updated on ${new Date().toLocaleString()}.</p>
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Security Notice:</strong> If you did not make this change, please contact our support team immediately and reset your password.
            </p>
          </div>
          <p>Your account security is important to us. Here are some tips:</p>
          <ul style="color: #4b5563;">
            <li>Use a strong, unique password</li>
            <li>Never share your password with anyone</li>
            <li>Enable two-factor authentication for added security</li>
            <li>Regularly update your password</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The iShelter Team
          </p>
        </div>
      `

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: user.email,
          subject: 'Password Changed Successfully',
          message: message,
          name: currentClient?.displayName || 'User'
        })
      })

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Error sending password change email:', error)
      return false
    }
  }

  const handleUpdatePassword = async () => {
    // Validate inputs
    if (!validatePasswords()) {
      return
    }

    setIsUpdating(true)
    const loadingToast = toast.loading('Updating password...')

    try {
      // Step 1: Re-authenticate user with current password
      await reauthenticateUser(passwords.current)

      // Step 2: Update password
      const user = auth.currentUser
      if (!user) {
        throw new Error('No user logged in')
      }

      await updatePassword(user, passwords.new)

      // Step 3: Send email notification
      await sendPasswordChangeEmail()

      // Step 4: Clear form and show success
      setPasswords({
        current: '',
        new: '',
        confirm: ''
      })
      setErrors({
        current: '',
        new: '',
        confirm: ''
      })

      toast.dismiss(loadingToast)
      toast.success('Password updated successfully! Email notification sent.')

    } catch (error) {
      console.error('Password update error:', error)
      toast.dismiss(loadingToast)

      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        setErrors(prev => ({
          ...prev,
          current: 'Incorrect current password'
        }))
        toast.error('Incorrect current password. Please try again.')
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again to update your password.')
      } else if (error.code === 'auth/weak-password') {
        setErrors(prev => ({
          ...prev,
          new: 'Password is too weak'
        }))
        toast.error('Password is too weak. Please choose a stronger password.')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Please try again later.')
      } else {
        toast.error('Failed to update password. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setPasswords({
      current: '',
      new: '',
      confirm: ''
    })
    setErrors({
      current: '',
      new: '',
      confirm: ''
    })
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-2">
        <FiLock className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Security</h2>
      </div>
      <p className="text-sm text-gray-600 mb-6">Manage your password and account security settings.</p>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current Password */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwords.current}
              onChange={(e) => handleInputChange('current', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                errors.current ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your current password"
              disabled={isUpdating}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isUpdating}
            >
              {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.current && (
            <p className="text-red-500 text-sm mt-1">{errors.current}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwords.new}
              onChange={(e) => handleInputChange('new', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                errors.new ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              disabled={isUpdating}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isUpdating}
            >
              {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.new && (
            <p className="text-red-500 text-sm mt-1">{errors.new}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) => handleInputChange('confirm', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                errors.confirm ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
              disabled={isUpdating}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isUpdating}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          {errors.confirm && (
            <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-2">Password Security Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
          <li>• Avoid using personal information or common words</li>
          <li>• Don't reuse passwords from other accounts</li>
          <li>• Consider using a password manager</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button 
          onClick={handleCancel}
          className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUpdating}
        >
          <FiX className="w-4 h-4" />
          Cancel
        </button>
        <button 
          onClick={handleUpdatePassword}
          className="flex items-center justify-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUpdating}
        >
          <FiCheck className="w-4 h-4" />
          {isUpdating ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </section>
  )
}