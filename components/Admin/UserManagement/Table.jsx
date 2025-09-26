'use client'
import { useState } from "react"
import { FiSearch, FiPlus, FiMoreVertical, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useUsers } from "@/contexts/UserContext"

const UserTable = () => {
  const { users, loading, error } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Role")
  const [statusFilter, setStatusFilter] = useState("All Status")

  // Generate initials from name or email
  const getInitials = (user) => {
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return user.email.slice(0, 2).toUpperCase()
  }

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "N/A"
    return timestamp.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Format last login time
  const formatLastLogin = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return "Never"
    
    const now = new Date()
    const loginDate = timestamp.toDate()
    const diffTime = Math.abs(now - loginDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return `Today, ${loginDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays === 2) {
      return `Yesterday, ${loginDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`
    } else {
      return formatDate(timestamp)
    }
  }

  // Get status based on last activity or user data
  const getStatus = (user) => {
    // You might want to adjust this logic based on your user data structure
    if (user.status) return user.status
    
    // Default status based on last login
    if (!user.lastLogin) return "Inactive"
    
    const lastLogin = user.lastLogin.toDate()
    const daysSinceLogin = Math.floor((new Date() - lastLogin) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLogin <= 7) return "Active"
    if (daysSinceLogin <= 30) return "Inactive"
    return "Suspended"
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = roleFilter === "All Role" || user.role === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "All Status" || getStatus(user) === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-700"
      case "success manager":
      case "successmanager":
        return "bg-green-100 text-green-700"
      case "client":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700"
      case "Inactive":
        return "bg-gray-100 text-gray-500"
      case "Suspended":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading users...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Filters and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Role Filter */}
              <div className="relative">
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Role</option>
                  <option>Admin</option>
                  <option>Success Manager</option>
                  <option>Client</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Add New User Button */}
            <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
              <FiPlus className="w-4 h-4" />
              Add New User
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-4">
          {filteredUsers.map((user) => {
            const status = getStatus(user)
            const formattedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"
            
            return (
              <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                      {getInitials(user)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.displayName || user.email}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                    >
                      {formattedRole}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}
                    >
                      {status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Login</p>
                    <p className="text-sm text-gray-900">{formatLastLogin(user.lastLogin)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Registered</p>
                    <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">User Name</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Email Address</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Last Login</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Registered Date</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const status = getStatus(user)
                const formattedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-700">
                          {getInitials(user)}
                        </div>
                        <span className="font-medium text-gray-900">{user.displayName || user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {formattedRole}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{formatLastLogin(user.lastLogin)}</td>
                    <td className="py-4 px-6 text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-6">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FiMoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm font-medium">1</button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">2</button>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded text-sm">15</button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTable