import { useState, useRef, useEffect } from "react"
import { FaChevronDown, FaCheck } from "react-icons/fa"

export default function UserDropdown({ 
  users, 
  selectedUser, 
  selectedUsers = [], 
  selectedUserIds = [], 
  placeholder, 
  onSelectUser, 
  isSubmitting, 
  type = "projectManager" 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (user) => {
    onSelectUser(user)
    if (type === "projectManager") {
      setIsOpen(false)
    }
  }

  const isSelected = (userId) => selectedUserIds.includes(userId)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSubmitting}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          {selectedUser ? (
            <>
              <div className={`w-6 h-6 rounded text-white text-xs font-semibold flex items-center justify-center ${
                type === "projectManager" ? "bg-orange-500" : "bg-blue-500"
              }`}>
                {getInitials(selectedUser)}
              </div>
              <span className="text-xs sm:text-sm text-gray-900">
                {selectedUser}
              </span>
            </>
          ) : (
            <span className="text-xs sm:text-sm text-gray-500">
              {placeholder}
            </span>
          )}
        </div>
        <FaChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {users.length === 0 ? (
            <div className="px-3 py-2 text-xs text-gray-500">
              {placeholder.includes("Loading") ? "Loading..." : "No users found"}
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelect(user)}
                disabled={type === "successManager" && isSelected(user.id)}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 ${
                  type === "successManager" && isSelected(user.id) 
                    ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded text-white text-xs font-semibold flex items-center justify-center ${
                  type === "projectManager" ? "bg-orange-500" : "bg-blue-500"
                }`}>
                  {getInitials(user.displayName)}
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-900">{user.displayName}</div>
                  <div className="text-[10px] text-gray-500">{user.email}</div>
                </div>
                {type === "successManager" && isSelected(user.id) && (
                  <FaCheck className="w-3 h-3 text-green-500 ml-auto" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}