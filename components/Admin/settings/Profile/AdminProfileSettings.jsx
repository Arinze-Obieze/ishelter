"use client"

import { useState, useEffect } from "react"
import { FiUser, FiCamera } from "react-icons/fi"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import toast from "react-hot-toast"
import Image from "next/image"

export default function AdminProfileSettings({ currentUser, userProfile, setUserProfile }) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Store original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    fullName: "",
    phoneNumber: "",
    photoURL: null
  })

  // Initialize state from props
  useEffect(() => {
    if (userProfile) {
      const name = userProfile.displayName || ""
      const phone = userProfile.phone || ""
      const photo = userProfile.photoURL || null
      
      setFullName(name)
      setPhoneNumber(phone)
      setProfilePicture(photo)
      
      setOriginalValues({
        fullName: name,
        phoneNumber: phone,
        photoURL: photo
      })
    }
  }, [userProfile])

  // Detect changes
  useEffect(() => {
    const nameChanged = fullName !== originalValues.fullName
    const phoneChanged = phoneNumber !== originalValues.phoneNumber
    const photoChanged = imagePreview !== null // New image selected
    
    setHasChanges(nameChanged || phoneChanged || photoChanged)
  }, [fullName, phoneNumber, imagePreview, originalValues])

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    
    // Allow international format
    if (value.startsWith('234')) {
      value = '+' + value
    } else if (value.startsWith('0') && value.length > 1) {
      value = '+234' + value.substring(1)
    }
    
    setPhoneNumber(value)
  }

  // Validate phone number (international format)
  const validatePhone = (phone) => {
    if (!phone) return true // Optional field
    
    // Basic international format validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image (JPG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Upload image to Firebase Storage
  const uploadProfileImage = async () => {
    if (!imagePreview || !currentUser?.uid) return null

    const file = document.getElementById('profile-image-input').files[0]
    if (!file) return null

    setIsUploadingImage(true)
    const loadingToast = toast.loading('Uploading image...')

    try {
      // Delete old profile picture if exists
      if (originalValues.photoURL) {
        try {
          const oldImageRef = ref(storage, originalValues.photoURL)
          await deleteObject(oldImageRef)
        } catch (error) {
          console.log('No old image to delete or deletion failed:', error)
        }
      }

      // Upload new image
      const timestamp = Date.now()
      const filename = `${timestamp}-${file.name}`
      const storageRef = ref(storage, `profile-pictures/${currentUser.uid}/${filename}`)
      
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      toast.dismiss(loadingToast)
      toast.success('Image uploaded successfully!')
      setIsUploadingImage(false)
      
      return downloadURL
    } catch (error) {
      console.error('Image upload error:', error)
      toast.dismiss(loadingToast)
      toast.error('Failed to upload image')
      setIsUploadingImage(false)
      return null
    }
  }

  // Send email notification
  const sendEmailNotification = async (changes) => {
    try {
      const changesText = changes.map(change => `<li><strong>${change.field}:</strong> ${change.message}</li>`).join('')
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userProfile?.email || currentUser?.email,
          subject: 'Admin Profile Updated Successfully',
          name: userProfile?.displayName || 'Admin',
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">Admin Profile Updated</h2>
              <p>Hello ${userProfile?.displayName || 'Admin'},</p>
              <p>Your admin profile was successfully updated on <strong>${new Date().toLocaleString()}</strong>.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">Changes Made:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  ${changesText}
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                <p style="margin: 5px 0 0 0;">If you did not make these changes, please contact support immediately.</p>
              </div>
              
              <p>Best regards,<br/>iShelter Team</p>
            </div>
          `
        })
      })
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  // Handle profile update
  const handleSaveChanges = async () => {
    // Validate inputs
    if (!fullName.trim()) {
      toast.error('Please enter your full name')
      return
    }

    if (phoneNumber && !validatePhone(phoneNumber)) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading('Updating profile...')

    try {
      const updates = {}
      const changes = []

      // Handle name change
      if (fullName !== originalValues.fullName) {
        updates.displayName = fullName.trim()
        changes.push({
            field: 'Full Name',
            message: `Changed to "${fullName.trim()}"`
          })
      }

      // Handle phone change
      if (phoneNumber !== originalValues.phoneNumber) {
        updates.phone = phoneNumber
        changes.push({
          field: 'Phone Number',
          message: phoneNumber ? `Changed to "${phoneNumber}"` : 'Removed'
        })
      }

      // Handle image upload
      if (imagePreview) {
        const photoURL = await uploadProfileImage()
        if (photoURL) {
          updates.photoURL = photoURL
          changes.push({
            field: 'Profile Picture',
            message: 'Updated'
          })
          setProfilePicture(photoURL)
        }
      }

      // Update Firestore
      if (Object.keys(updates).length > 0) {
        const userRef = doc(db, 'users', currentUser.uid)
        await updateDoc(userRef, updates)

        // Update original values
        setOriginalValues({
          fullName: updates.displayName || originalValues.fullName,
          phoneNumber: updates.phone !== undefined ? updates.phone : originalValues.phoneNumber,
          photoURL: updates.photoURL || originalValues.photoURL
        })

        // Update userProfile state in parent
        setUserProfile(prev => ({ ...prev, ...updates }))

        // Send email notification (don't wait)
        if (changes.length > 0) {
          sendEmailNotification(changes)
        }

        toast.dismiss(loadingToast)
        toast.success('Profile updated successfully!')
        
        // Clear image preview
        setImagePreview(null)
      } else {
        toast.dismiss(loadingToast)
        toast('No changes to save', { icon: 'ℹ️' })
      }

    } catch (error) {
      console.error('Profile update error:', error)
      toast.dismiss(loadingToast)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600 text-sm mb-6">Update your personal details and profile picture</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture and Upload */}
          <div className="flex flex-col items-start">
            <div className="relative w-24 h-24 mb-4">
              {imagePreview || profilePicture ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={imagePreview || profilePicture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <FiUser className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <label 
                htmlFor="profile-image-input"
                className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-amber-600 transition-colors"
              >
                <FiCamera className="w-4 h-4 text-white" />
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isLoading || isUploadingImage}
              />
            </div>
            <p className="text-xs text-gray-500">
              JPG, PNG or WebP. Max 5MB.
            </p>
            {imagePreview && (
              <button
                onClick={() => setImagePreview(null)}
                className="mt-2 text-xs text-red-500 hover:text-red-600"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
              <input
                type="text"
                value="Admin"
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed capitalize"
              />
              <p className="text-gray-500 text-xs mt-1">Role cannot be changed</p>
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
              onChange={handlePhoneChange}
              placeholder="+234 XXX XXX XXXX"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">International format (e.g., +234...)</p>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
            <input
              type="email"
              value={userProfile?.email || currentUser?.email || ""}
              disabled
              className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 cursor-not-allowed"
            />
            <p className="text-gray-500 text-xs mt-1">Email address cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSaveChanges}
          disabled={isLoading || !hasChanges}
          className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Changes</span>
          )}
        </button>
      </div>
    </div>
  )
}
