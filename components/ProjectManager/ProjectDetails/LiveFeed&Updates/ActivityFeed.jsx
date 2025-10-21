"use client"

import { useState, useEffect } from "react"
import { MdCheckCircle } from "react-icons/md"
import ActivityItem from "./ActivityItem"
import { useLiveFeed } from "@/contexts/LiveFeedContext"

export default function ActivityFeed({ projectId }) {
  const { updates, subscribeToUpdates } = useLiveFeed()
  const [expandedComments, setExpandedComments] = useState([])

  useEffect(() => {
    const unsub = subscribeToUpdates(projectId)
    return () => unsub && unsub()
  }, [projectId, subscribeToUpdates])

  const toggleComments = (id) => {
    setExpandedComments((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      {/* Activity Feed Header */}
      <div className="flex items-center gap-2 mb-6">
        <MdCheckCircle className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
      </div>

      {/* Filters - Mobile */}
      <div className="md:hidden space-y-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
          <input
            type="text"
            placeholder="Select date range..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <input
            type="text"
            placeholder="Select type..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Posted by</label>
          <input
            type="text"
            placeholder="Select user..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
          <input
            type="text"
            placeholder="Select date range..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <input
            type="text"
            placeholder="Select type..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Posted by</label>
          <input
            type="text"
            placeholder="Select user..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Activity Items */}
      <div className="space-y-4">
        {updates.length === 0 ? (
          <div className="text-gray-500">No updates yet.</div>
        ) : (
          updates.map((activity) => (
            <div key={activity.id} className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={activity.createdBy?.photoURL || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">{activity.createdBy?.name || "Unknown"}</span>
                <span className="text-xs text-gray-400">
                  {activity.createdAt?.seconds
                    ? new Date(activity.createdAt.seconds * 1000).toLocaleString()
                    : ""}
                </span>
                {activity.isInternal && (
                  <span className="ml-2 px-2 py-1 bg-primary text-white text-xs rounded">Internal</span>
                )}
              </div>
              <div className="mb-2 text-gray-800">{activity.description}</div>
              <div className="mb-2 text-sm text-gray-500">Type: {activity.updateType}</div>
              {activity.media && activity.media.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {activity.media.map((m, idx) =>
                    m.contentType.startsWith("image") ? (
                      <img key={idx} src={m.url} alt={m.name} className="w-24 h-24 object-cover rounded" />
                    ) : (
                      <video key={idx} src={m.url} controls className="w-32 h-24 rounded" />
                    )
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
