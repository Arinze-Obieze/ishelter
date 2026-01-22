'use client'
import React, { useState } from 'react'
import { FiUsers, FiUserPlus, FiTrash2, FiMail, FiLock, FiUser, FiAlertTriangle, FiCheck, FiX, FiShield, FiSearch, FiLoader } from 'react-icons/fi'
import { auth } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { useCsrf } from '@/contexts/CsrfContext'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAdminsPaginated } from '@/utils/queries/adminQueries'

const AdminManagement = ({ currentUserProfile }) => {
  const { currentUser } = useAuth()
  const { getToken: getCsrfToken } = useCsrf()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const queryClient = useQueryClient()

  // React Query for Admins
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['admins'],
    queryFn: ({ pageParam }) => fetchAdminsPaginated({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
  })

  // Flatten the data pages into a single array
  const admins = data?.pages.flatMap(page => page.admins) || []

  // Create Admin Mutation
  const createAdminMutation = useMutation({
    mutationFn: async (formData) => {
      const token = await auth.currentUser.getIdToken()
      const csrfToken = getCsrfToken()

      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          displayName: formData.displayName.trim(),
          password: formData.password,
          createdBy: currentUser.uid
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to create admin')
      return { result, formData } // pass formData for email
    },
    onSuccess: async (data) => {
      // Optimistically UI update
      toast.success('Admin account created! Sending welcome email...')
      setShowAddModal(false)
      queryClient.invalidateQueries(['admins'])
      
      // Send email in background (Fire-and-Forget style for UI, but we await it here to ensure it sends)
      try {
        await sendWelcomeEmail(data.formData.email, data.formData.displayName, data.formData.password)
      } catch (e) {
        console.error("Welcome email failed", e)
        toast.error("Account created, but welcome email failed.")
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create admin account')
    }
  })

  // Delete Admin Mutation
  const deleteAdminMutation = useMutation({
    mutationFn: async (adminId) => {
      const token = await auth.currentUser.getIdToken()
      const csrfToken = getCsrfToken()
      
      const response = await fetch('/api/admin/delete-admin', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          adminId: adminId,
          deletedBy: currentUser.uid
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to delete admin')
      return result
    },
    onSuccess: () => {
      toast.success('Admin account deleted successfully')
      setShowDeleteModal(false)
      setSelectedAdmin(null)
      queryClient.invalidateQueries(['admins'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete admin account')
    }
  })

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  })

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate form
  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    if (!formData.displayName.trim()) {
      toast.error('Full name is required')
      return false
    }

    if (!formData.password) {
      toast.error('Password is required')
      return false
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }

    // Check if email already exists
    if (admins.some(admin => admin.email.toLowerCase() === formData.email.toLowerCase())) {
      toast.error('An admin with this email already exists')
      return false
    }

    return true
  }

  // Handle create admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    createAdminMutation.mutate(formData)
  }

  // Send welcome email
  const sendWelcomeEmail = async (email, name, tempPassword) => {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to iShelter Admin Team',
          name: name,
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #f97316;">Welcome to the Admin Team! 🎉</h2>
              <p>Hello ${name},</p>
              <p>You have been added as an administrator to the iShelter platform by <strong>${currentUserProfile?.displayName || 'Admin'}</strong>.</p>
              
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #1f2937;">Your Login Credentials:</h3>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background: #fff; padding: 4px 8px; border-radius: 4px;">${tempPassword}</code></p>
              </div>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
                <p style="margin: 0;"><strong>⚠️ Important Security Notice:</strong></p>
                <p style="margin: 5px 0 0 0;">Please change your password immediately after your first login for security purposes.</p>
              </div>
              
              <div style="margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/login" 
                   style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Login to Dashboard
                </a>
              </div>
              
              <p>If you have any questions or did not expect this email, please contact support immediately.</p>
              
              <p>Best regards,<br/>iShelter Team</p>
            </div>
          `
        })
      })
  }

  // Handle delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return

    // Prevent self-deletion (additional client-side check)
    if (selectedAdmin.id === currentUser.uid) {
      toast.error('You cannot delete your own admin account')
      setShowDeleteModal(false)
      return
    }

    deleteAdminMutation.mutate(selectedAdmin.id)
  }

  // Filter admins by search term (only works on loaded admins, ideal for UX but for full search you need server side search)
  const filteredAdmins = admins.filter(admin => 
    admin.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Get initials
  const getInitials = (name) => {
    if (!name) return 'AD'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <FiShield className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Admin Management</h3>
              <p className="text-gray-600 text-sm">Manage admin accounts and permissions</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
          >
            <FiUserPlus className="w-5 h-5" />
            <span>Add New Admin</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search admins by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Admins List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading admins...</p>
          </div>
        ) : isError ? (
           <div className="p-8 text-center">
            <p className="text-red-500">Error loading admins: {error.message}</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-8 text-center">
            <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No admins found matching your search' : 'No admin accounts found'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Created
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        {admin.photoURL ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            <Image
                              src={admin.photoURL}
                              alt={admin.displayName || 'Admin'}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold flex-shrink-0">
                            {getInitials(admin.displayName || admin.email)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {admin.displayName || 'Unnamed Admin'}
                            {admin.id === currentUser.uid && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 truncate md:hidden">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-900 break-all max-w-xs">{admin.email}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                      <p className="text-sm text-gray-600">{formatDate(admin.createdAt)}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right">
                      {admin.id !== currentUser.uid && (
                        <button
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setShowDeleteModal(true)
                          }}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">Delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Load More Button */}
        {hasNextPage && !searchTerm && (
          <div className="p-4 flex justify-center border-t border-gray-200">
             <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-orange-600 font-medium hover:text-orange-700 flex items-center gap-2"
            >
              {isFetchingNextPage ? (
                <>
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                  Loading more...
                </>
              ) : (
                'Load More Admins'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FiAlertTriangle className="w-5 h-5 text-blue-500" />
          Admin Management Guidelines
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>New admins will receive a welcome email with their login credentials</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Admins should change their password immediately after first login</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>You cannot delete your own admin account for security reasons</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>Cannot delete the last admin - at least one admin must exist</span>
          </li>
          <li className="flex items-start gap-2">
            <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>All admin actions are logged for security auditing</span>
          </li>
        </ul>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Admin</h3>
                <button
                  onClick={() => !createAdminMutation.isPending && setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={createAdminMutation.isPending}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@example.com"
                      disabled={createAdminMutation.isPending}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      placeholder="John Doe"
                      disabled={createAdminMutation.isPending}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      disabled={createAdminMutation.isPending}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This will be their temporary password</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter password"
                      disabled={createAdminMutation.isPending}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> The new admin will receive their login credentials via email and should change their password immediately after first login.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={createAdminMutation.isPending}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAdminMutation.isPending}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {createAdminMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Admin</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Admin Account</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-3">
                  Are you sure you want to delete the admin account for:
                </p>
                <div className="flex items-center gap-3">
                  {selectedAdmin.photoURL ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <Image
                        src={selectedAdmin.photoURL}
                        alt={selectedAdmin.displayName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                      {getInitials(selectedAdmin.displayName || selectedAdmin.email)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{selectedAdmin.displayName}</p>
                    <p className="text-sm text-gray-600">{selectedAdmin.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedAdmin(null)
                  }}
                  disabled={deleteAdminMutation.isPending}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  disabled={deleteAdminMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteAdminMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete Admin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManagement