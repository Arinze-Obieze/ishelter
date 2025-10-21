"use client"

// This file is optional - ActivityFeed now renders updates directly
// Keep this file if you want to extract the update card into a separate component

import { useState } from "react"
import { FiMoreVertical, FiTrash2 } from "react-icons/fi"
import { useLiveFeed } from "@/contexts/LiveFeedContext"
import { toast } from "react-hot-toast"

export default function ActivityItem({ update, projectId }) {
  const [showMenu, setShowMenu] = useState(false)
  const { deleteUpdate } = useLiveFeed()

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this update?")) return
    
    const success = await deleteUpdate(update.id, projectId, update.updateType)
    if (success) {
      setShowMenu(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {/* User Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <img
            src={update.createdBy?.photoURL || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/default-avatar.png"
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">
                {update.createdBy?.name || "Unknown User"}
              </span>
              <span className="text-xs text-gray-400">
                {update.createdAt?.seconds
                  ? new Date(update.createdAt.seconds * 1000).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : ""}
              </span>
            </div>
            {update.updateType && (
              <span className="inline-block mt-1 px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
                {update.updateType}
              </span>
            )}
          </div>
        </div>

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <FiMoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
              >
                <FiTrash2 size={14} />
                Delete Update
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 text-gray-800 whitespace-pre-wrap">
        {update.description}
      </div>

      {/* Media */}
      {update.media && update.media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {update.media.map((m, idx) => (
            <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden">
              {m.contentType.startsWith("image") ? (
                <img 
                  src={m.url} 
                  alt={m.name} 
                  className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(m.url, '_blank')}
                />
              ) : (
                <video 
                  src={m.url} 
                  controls 
                  className="w-full h-48 object-cover rounded"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 truncate">
                {m.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}