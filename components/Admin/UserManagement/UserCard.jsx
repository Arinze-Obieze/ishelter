import { FiMoreVertical } from "react-icons/fi"
import UserAvatar from "@/components/Admin/UserManagement/UserAvatar"
import Badge from "@/components/ui/Badge"
import { formatLastLogin, formatDate } from "@/utils/dateFormatters"
import { getStatus } from "@/utils/userHelpers"

const UserCard = ({ user }) => {
  const status = getStatus(user)
  const formattedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"

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
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical className="w-5 h-5" />
        </button>
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