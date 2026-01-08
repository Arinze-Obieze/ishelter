'use client'
import { useState, useEffect } from "react"
import { useUsers } from "@/contexts/UserContext"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useCsrf } from "@/contexts/CsrfContext"
import UserTableHeader from "@/components/Admin/UserManagement/UserTableHeader"
import UserTableDesktop from "@/components/Admin/UserManagement/UserTableDesktop"
import UserTableMobile from "@/components/Admin/UserManagement/UserTableMobile"
import AddUserModal from "@/components/modals/AddUserModal"
import EditUserModal from "@/components/modals/EditUserModal"
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal"
import { getStatus } from "@/utils/userHelpers"
import toast from "react-hot-toast"



const UserTable = () => {
  const { users, loading, error } = useUsers()
  const { getToken: getCsrfToken } = useCsrf()
  const [currentUser, setCurrentUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("All Role")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Get current user directly
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return unsubscribe
  }, [])

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.displayName && user.displayName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesRole = roleFilter === "All Role" || user.role === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "All Status" || getStatus(user) === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEditUser = (user) => {
    console.log('✏️ Edit user:', user.email);
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    console.log('🗑️ Delete user:', user.email);
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const handleSaveEdit = async (updates) => {
    if (!selectedUser || !currentUser) {
      console.error('No user selected or not authenticated')
      return
    }

    setActionLoading(true)
    try {
      const token = await currentUser.getIdToken()
      const csrfToken = getCsrfToken()
      
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          updates,
          updatedByAdmin: {
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || 'Admin'
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user')
      }

      toast.success('User updated successfully')
      setIsEditModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser || !currentUser) {
      console.error('No user selected or not authenticated')
      return
    }

    setActionLoading(true)
    try {
      const token = await currentUser.getIdToken()
      const csrfToken = getCsrfToken()
      
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          userEmail: selectedUser.email,
          deletedByAdmin: {
            id: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || 'Admin'
          }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }

      toast.success('User deleted successfully')
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.success(error.message || 'Failed to delete user')
    } finally {
      setActionLoading(false)
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
    <div className=" p-2 md:p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <UserTableHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onAddUser={() => setIsAddModalOpen(true)}
        />

        <UserTableMobile 
          users={filteredUsers} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
        <UserTableDesktop 
          users={filteredUsers} 
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />

        {/* Basic pagination info */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={handleSaveEdit}
        loading={actionLoading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        loading={actionLoading}
      />
    </div>
  )
}

export default UserTable