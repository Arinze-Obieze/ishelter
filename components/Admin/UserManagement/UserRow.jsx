import { FiMoreVertical } from "react-icons/fi"
import UserAvatar from "@/components/Admin/UserManagement/UserAvatar"
import Badge from "@/components/ui/Badge"
import { formatLastLogin, formatDate } from "@/utils/dateFormatters"
import { getStatus } from "@/utils/userHelpers"

const UserRow = ({ user }) => {
  const status = getStatus(user)
  const formattedRole = user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"

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
        <button className="text-gray-400 hover:text-gray-600">
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </td>
    </tr>
  )
}

export default UserRow