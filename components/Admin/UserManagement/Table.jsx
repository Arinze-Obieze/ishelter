'use client'
import { useState } from "react"
import { useUsers } from "@/contexts/UserContext"
import UserTableHeader from "@/components/Admin/UserManagement/UserTableHeader"
import UserTableDesktop from "@/components/Admin/UserManagement/UserTableDesktop"
import UserTableMobile from "@/components/Admin/UserManagement/UserTableMobile"
import AddUserModal from "@/components/modals/AddUserModal"
import { getStatus } from "@/utils/userHelpers"

const UserTable = () => {
  const { users, loading, error } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Role")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = roleFilter === "All Role" || user.role === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "All Status" || getStatus(user) === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

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
        <UserTableHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddUser={() => setIsModalOpen(true)}
        />

        <UserTableMobile users={filteredUsers} />
        <UserTableDesktop users={filteredUsers} />

        {/* Basic pagination info */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default UserTable