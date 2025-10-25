"use client"

import { FiUser } from "react-icons/fi"
import { useUsers } from '@/contexts/UserContext'
import { auth } from '@/lib/firebase'
import { useEffect, useState } from 'react'

export default function ProfileInformation() {
  const { users } = useUsers()
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    location: '',
    createdAt: '',
    photoURL: ''
  })

  // Get current authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })
    return () => unsubscribe()
  }, [])

  // Find user details from users context and populate form data
  useEffect(() => {
    if (currentUser && users.length > 0) {
      const userDetails = users.find(u => u.id === currentUser.uid)
      if (userDetails) {
        setUserData({
          displayName: userDetails.displayName ||  currentUser.displayName || '',
          email: userDetails.email || currentUser.email || '',
          phoneNumber: userDetails.phoneNumber || userDetails.phone || currentUser.phoneNumber || '+234 801 234 5678',
          location: userDetails.location || userDetails.address || 'Lagos, Nigeria',
          createdAt: userDetails.createdAt ? new Date(userDetails.createdAt.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'May 10, 2023',
          photoURL: userDetails.photoURL || userDetails.avatar || '/professional-profile-avatar.png'
        })
      } else {
        // Fallback to Firebase auth data
        setUserData({
          displayName: currentUser.displayName || 'Oluwaseun Adebayo',
          email: currentUser.email || 'oluwaseun@example.com',
          phoneNumber: currentUser.phoneNumber || '+234 801 234 5678',
          location: 'Lagos, Nigeria',
          createdAt: currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'May 10, 2023',
          photoURL: currentUser.photoURL || '/professional-profile-avatar.png'
        })
      }
    }
  }, [currentUser, users])

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = () => {
    // Here you would typically update the user data in Firebase
    console.log('Saving user data:', userData)
    // Add your update logic here
  }

  const handleCancel = () => {
    // Reset form data to original values
    if (currentUser && users.length > 0) {
      const userDetails = users.find(u => u.id === currentUser.uid)
      if (userDetails) {
        setUserData({
          displayName: userDetails.displayname || userDetails.displayName || currentUser.displayName || '',
          email: userDetails.email || currentUser.email || '',
          phoneNumber: userDetails.phoneNumber || userDetails.phone || currentUser.phoneNumber || '+234 801 234 5678',
          location: userDetails.location || userDetails.address || 'Lagos, Nigeria',
          createdAt: userDetails.createdAt ? new Date(userDetails.createdAt.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'May 10, 2023',
          photoURL: userDetails.photoURL || userDetails.avatar || '/professional-profile-avatar.png'
        })
      }
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <FiUser className="w-6 h-6 text-orange-500" />
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-8 border-b border-gray-200">
        <img 
          src={userData.photoURL} 
          alt="Profile" 
          className="w-20 h-20 rounded-full object-cover" 
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{userData.displayName}</h3>
          <p className="text-sm text-gray-500">Account created on {userData.createdAt}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={userData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={userData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={userData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button 
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveChanges}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </div>
    </section>
  )
}