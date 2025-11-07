// components/Admin/UserManagement/UserCard.jsx
'use client'
import { useState, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2 } from "react-icons/fi"
import UserAvatar from "@/components/Admin/UserManagement/UserAvatar"
import Badge from "@/components/ui/Badge"
import { formatLastLogin, formatDate } from "@/utils/dateFormatters"
import { getStatus } from "@/utils/userHelpers"

const UserCard = ({ user, onEdit, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const status = getStatus(user);
  const formattedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"

  // Fix hydration by only rendering dropdown on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleEdit = () => {
    setShowDropdown(false);
    if (onEdit && typeof onEdit === 'function') {
      onEdit(user);
    }
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (onDelete && typeof onDelete === 'function') {
      onDelete(user);
    } else {
      console.error('onDelete is not a function or not provided');
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900">{user.displayName || user.email}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FiMoreVertical className="w-5 h-5" />
          </button>
          
          {isClient && showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit User
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Role</p>
          <Badge variant="role">{formattedRole}</Badge>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Status</p>
          <Badge variant="status">{status}</Badge>
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
}

export default UserCard