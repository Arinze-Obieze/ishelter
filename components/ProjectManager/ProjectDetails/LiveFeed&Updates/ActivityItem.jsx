"use client"

import { useState } from "react"
import { FiChevronDown, FiMoreVertical, FiMessageCircle } from "react-icons/fi"
import { MdPlayArrow } from "react-icons/md"

export default function ActivityItem({ activity, isExpanded, onToggleComments }) {
  const [isFocused, setIsFocused] = useState(false)

  const getBadgeColor = (badge) => {
    if (badge === "Milestone Completion") return "bg-green-100 text-green-700"
    if (badge === "Orange Status") return "bg-orange-100 text-orange-700"
    if (badge === "Daily Update") return "bg-blue-100 text-blue-700"
    if (badge === "Site Issue") return "bg-red-100 text-red-700"
    if (badge === "Internal Only") return "bg-gray-100 text-gray-700"
    if (badge === "Weekly Update") return "bg-purple-100 text-purple-700"
    return "bg-gray-100 text-gray-700"
  }

  return (
    <div
      className={`bg-white border-l-4 rounded-lg p-4 md:p-6 hover:shadow-md transition-all cursor-pointer ${
        isFocused ? "border-l-orange-500 shadow-md" : "border-l-gray-200"
      }`}
      onClick={() => setIsFocused(!isFocused)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {activity.avatar}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{activity.author}</h3>
              <span className="text-xs text-gray-500">{activity.role}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
          </div>
        </div>

        {/* More Options */}
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activity.badges.map((badge, idx) => (
          <span key={idx} className={`text-xs font-medium px-2 py-1 rounded-full ${getBadgeColor(badge)}`}>
            {badge}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{activity.description}</p>

      {/* Images - Mobile Grid */}
      {activity.images.length > 0 && (
        <div className="md:hidden grid grid-cols-2 gap-2 mb-4">
          {activity.images.map((image, idx) => (
            <div key={idx} className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square">
              <img
                src={image || "/placeholder.svg"}
                alt={`Activity image ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {idx === activity.images.length - 1 && activity.images.length > 2 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{activity.images.length - 2}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Images - Desktop Grid */}
      {activity.images.length > 0 && (
        <div className="hidden md:grid md:grid-cols-3 gap-3 mb-4">
          {activity.images.map((image, idx) => (
            <div key={idx} className="relative bg-gray-200 rounded-lg overflow-hidden aspect-square group">
              <img
                src={image || "/placeholder.svg"}
                alt={`Activity image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
              {idx === 2 && activity.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold">+{activity.images.length - 3}</span>
                </div>
              )}
              {idx === 1 && activity.images.length === 2 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MdPlayArrow className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comments Section */}
      {activity.comments.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          {/* Comments Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleComments()
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
          >
            <FiMessageCircle className="w-4 h-4" />
            <span>
              {activity.commentCount} {activity.commentCount === 1 ? "comment" : "comments"}
            </span>
            <FiChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>

          {isExpanded && (
            <div className="space-y-3 bg-gray-50 rounded-lg p-3">
              {activity.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3 bg-white p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                    {comment.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.role}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View More Button */}
      <div className="flex justify-end mt-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
          View
        </button>
      </div>
    </div>
  )
}
