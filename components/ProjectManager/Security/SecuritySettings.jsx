'use client'
import React from 'react'
import { FiLock, FiLogOut, FiMonitor, FiShield, FiSmartphone } from 'react-icons/fi'
import { useState } from "react"

const SecuritySettings = () => {

const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
 
return (
    <div className="space-y-6">
             {/* Change Password Section */}
             <div className="bg-white rounded-lg p-6 border border-gray-200">
               <div className="flex items-start gap-3 mb-4">
                 <FiLock className="w-6 h-6 text-gray-900 flex-shrink-0 mt-0.5" />
                 <div>
                   <h3 className="text-lg sm:text-xl font-bold text-gray-900">Change Password</h3>
                   <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
                 </div>
               </div>
   
               <div className="space-y-4">
                 {/* Current Password */}
                 <div>
                   <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
                   <input
                     type="password"
                     value={currentPassword}
                     onChange={(e) => setCurrentPassword(e.target.value)}
                     placeholder="Enter current password"
                     className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                   />
                 </div>
   
                 {/* New Password */}
                 <div>
                   <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
                   <input
                     type="password"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Enter new password"
                     className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                   />
                 </div>
   
                 {/* Confirm Password */}
                 <div>
                   <label className="block text-sm font-medium text-gray-900 mb-2">Confirm New Password</label>
                   <input
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     placeholder="Confirm new password"
                     className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                   />
                 </div>
   
                 <button className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                   Update Password
                 </button>
               </div>
             </div>

           </div>
  )
}

export default SecuritySettings
