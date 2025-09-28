import { getInitials } from "@/utils/userHelpers"

const UserAvatar = ({ user, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700`}>
      {getInitials(user)}
    </div>
  )
}

export default UserAvatar