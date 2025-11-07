'use client'
import { useState, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2 } from 'react-icons/fi';
import UserAvatar from "@/components/Admin/UserManagement/UserAvatar"
import Badge from "@/components/ui/Badge"
import { formatLastLogin, formatDate } from "@/utils/dateFormatters"
import { getStatus } from "@/utils/userHelpers"

const UserRow = ({ user, onEdit, onDelete }) => {
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
    } else {
      console.error('❌ UserRow - onEdit is not a function');
    }
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (onDelete && typeof onDelete === 'function') {
      onDelete(user);
    } else {
      console.error('❌ UserRow - onDelete is not a function. Value:', onDelete);
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="sm" />
          <span className="font-medium text-gray-900">{user.displayName || user.email}</span>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-600">{user.email}</td>
      <td className="py-4 px-6">
        <Badge variant="role">{formattedRole}</Badge>
      </td>
      <td className="py-4 px-6">
        <Badge variant="status">{status}</Badge>
      </td>
      <td className="py-4 px-6 text-gray-600">{formatLastLogin(user.lastLogin)}</td>
      <td className="py-4 px-6 text-gray-600">{formatDate(user.createdAt)}</td>
      <td className="py-4 px-6">
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
      </td>
    </tr>
  )
}

export default UserRow