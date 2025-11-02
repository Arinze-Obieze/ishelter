"use client"

import { FiUser, FiEdit, FiX, FiCheck } from "react-icons/fi"
import { useCurrentClient } from '@/contexts/CurrentClientContext'
import { auth, db } from '@/lib/firebase'
import { useEffect, useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { toast } from 'react-hot-toast'

export default function ProfileInformation() {
  const { currentClient, loading, error } = useCurrentClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
  const [password, setPassword] = useState('')
  
  // Get country options
  const countryOptions = countryList().getData()
  
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: '',
    createdAt: '',
    role: '',
    status: ''
  })

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: null
  })

  // Custom styles for react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      '&:hover': {
        borderColor: '#d1d5db'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      overflow: 'hidden'
    })
  }

  // Send email notification function
  const sendEmailNotification = async (updates, oldEmail = null) => {
    try {
      const subject = oldEmail ? "Email Address Updated" : "Profile Updated Successfully";
      
      let changes = Object.keys(updates).map(key => 
        `• ${key}: ${updates[key]}`
      ).join('\n');
      
      // If email was changed, show both old and new email
      if (oldEmail) {
        changes = `• email: ${oldEmail} → ${updates.email}\n${changes.replace('• email:', '')}`;
      }

      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ea580c;">${subject}</h2>
          <p>Hello <strong>${userData.displayName}</strong>,</p>
          <p>Your profile has been successfully updated with the following changes:</p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <pre style="font-family: inherit; white-space: pre-wrap;">${changes}</pre>
          </div>
          ${oldEmail ? `<p><strong>Important:</strong> Your login email has been changed from ${oldEmail} to ${updates.email}. Please use your new email address to sign in.</p>` : ''}
          <p>If you did not make these changes, please contact support immediately.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The iShelter Team
          </p>
        </div>
      `;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: oldEmail || userData.email, // Send to old email if email was changed
          subject: subject,
          message: message,
          name: userData.displayName
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        console.error('Email notification failed:', result.error);
      }
      
      return result.success;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }

  // Update when currentClient changes
  useEffect(() => {
    if (currentClient) {
      const processedData = {
        displayName: currentClient.displayName || '',
        email: currentClient.email || '',
        phoneNumber: currentClient.phoneNumber || currentClient.phone || '',
        location: currentClient.location || currentClient.address || '',
        role: currentClient.role || '',
        status: currentClient.status || '',
        createdAt: currentClient.createdAt ? 
          (typeof currentClient.createdAt === 'string' 
            ? new Date(currentClient.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : new Date(currentClient.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
          ) : '',
      }

      setUserData(processedData)
      setFormData({
        displayName: processedData.displayName,
        email: processedData.email,
        phoneNumber: processedData.phoneNumber,
        location: processedData.location ? countryOptions.find(c => c.label === processedData.location) : null
      })
    }
  }, [currentClient, countryOptions])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setIsUpdatingEmail(false)
    setPassword('')
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsUpdatingEmail(false)
    setPassword('')
    // Reset form data to original values
    setFormData({
      displayName: userData.displayName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      location: userData.location ? countryOptions.find(c => c.label === userData.location) : null
    })
  }

  // Reauthenticate user for sensitive operations (email change)
  const reauthenticateUser = async (password) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error('No user logged in');
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
  }

  const handleUpdate = async () => {
    if (!currentClient) return

    try {
      toast.loading('Updating profile...')

      const updates = {}
      let emailChanged = false
      let oldEmail = null
      
      // Only update fields that have changed
      if (formData.displayName !== userData.displayName && formData.displayName.trim() !== '') {
        updates.displayName = formData.displayName
      }
      
      if (formData.phoneNumber !== userData.phoneNumber && formData.phoneNumber.trim() !== '') {
        updates.phoneNumber = formData.phoneNumber
      }
      
      if (formData.location && formData.location.label !== userData.location) {
        updates.location = formData.location.label
      }

      // Check if email changed and handle authentication
      if (formData.email !== userData.email && formData.email.trim() !== '') {
        if (!password) {
          // If email changed but no password provided, show password prompt
          setIsUpdatingEmail(true)
          toast.dismiss()
          toast.error('Please enter your password to update email')
          return
        }

        // Reauthenticate user before changing email
        await reauthenticateUser(password)
        
        // Update email in Firebase Auth
        const user = auth.currentUser
        if (user) {
          await updateEmail(user, formData.email.trim())
          updates.email = formData.email.trim()
          emailChanged = true
          oldEmail = userData.email
        }
      }

      if (Object.keys(updates).length > 0 || emailChanged) {
        // Update Firestore
        await updateDoc(doc(db, 'users', currentClient.id), {
          ...updates,
          updatedAt: serverTimestamp()
        })

        // Update local state
        setUserData(prev => ({
          ...prev,
          ...updates,
          location: formData.location ? formData.location.label : prev.location
        }))

        // Send email notification for the update
        await sendEmailNotification(updates, oldEmail);

        toast.dismiss()
        toast.success(emailChanged ? 
          'Email updated successfully! Please use your new email to sign in.' : 
          'Profile updated successfully! Email notification sent.'
        )
      } else {
        toast.dismiss()
        toast.success('No changes to update')
      }

      setIsEditing(false)
      setIsUpdatingEmail(false)
      setPassword('')
      
    } catch (error) {
      toast.dismiss()
      console.error('Update error:', error)
      
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password. Please try again.')
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again to update your email.')
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already in use by another account.')
      } else {
        toast.error('Failed to update profile. Please try again.')
      }
    }
  }

  // Loading state
  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <FiUser className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center text-red-600">
          <p>Error loading profile: {error}</p>
        </div>
      </section>
    )
  }

  if (!currentClient) {
    return (
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center text-gray-600">
          <p>No user data found</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiUser className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>
        
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition"
          >
            <FiEdit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Add your full name"
              autoComplete="name"
            />
          ) : (
            <div className={`px-4 py-2 border border-transparent rounded-lg ${userData.displayName ? 'bg-gray-50' : 'bg-gray-100 text-gray-500'}`}>
              {userData.displayName || 'Not set'}
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Add your email address"
                autoComplete="email"
              />
              {isUpdatingEmail && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password to Update Email
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <p className="text-sm text-gray-600">
                    For security reasons, please enter your password to change your email address.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`px-4 py-2 border border-transparent rounded-lg ${userData.email ? 'bg-gray-50' : 'bg-gray-100 text-gray-500'}`}>
              {userData.email || 'Not set'}
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Add your phone number"
              autoComplete="tel"
            />
          ) : (
            <div className={`px-4 py-2 border border-transparent rounded-lg ${userData.phoneNumber ? 'bg-gray-50' : 'bg-gray-100 text-gray-500'}`}>
              {userData.phoneNumber || 'Not set'}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          {isEditing ? (
            <Select
              options={countryOptions}
              value={formData.location}
              onChange={(selected) => handleInputChange('location', selected)}
              placeholder="Select your country"
              styles={customStyles}
              isSearchable
              autoComplete="country-name"
            />
          ) : (
            <div className={`px-4 py-2 border border-transparent rounded-lg ${userData.location ? 'bg-gray-50' : 'bg-gray-100 text-gray-500'}`}>
              {userData.location || 'Not set'}
            </div>
          )}
        </div>
      </div>

      {/* Role and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <div className="text-gray-600">{userData.role || 'Not set'}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="text-gray-600">{userData.status || 'Not set'}</div>
        </div>
      </div>

      {/* Account Creation Date */}
      {userData.createdAt && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Created</label>
          <div className="text-gray-600">{userData.createdAt}</div>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button 
            onClick={handleCancel}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            <FiX className="w-4 h-4" />
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
          >
            <FiCheck className="w-4 h-4" />
            Update Profile
          </button>
        </div>
      )}
    </section>
  )
}