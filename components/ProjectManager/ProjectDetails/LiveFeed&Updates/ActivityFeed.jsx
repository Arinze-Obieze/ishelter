"use client"

import { useState, useEffect, useMemo } from "react"
import { MdCheckCircle } from "react-icons/md"
import ActivityItem from "./ActivityItem"
import { useLiveFeed } from "@/contexts/LiveFeedContext"

export default function ActivityFeed({ projectId }) {
  const { updates, subscribeToUpdates } = useLiveFeed()
  const [expandedComments, setExpandedComments] = useState([])
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")

  useEffect(() => {
    const unsub = subscribeToUpdates(projectId)
    return () => unsub && unsub()
  }, [projectId, subscribeToUpdates])

  const toggleComments = (id) => {
    setExpandedComments((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Extract unique update types from updates
  const uniqueTypes = useMemo(() => {
    const types = new Set(updates.map(u => u.updateType).filter(Boolean))
    return Array.from(types).sort()
  }, [updates])

  // Extract unique users from updates
  const uniqueUsers = useMemo(() => {
    const usersMap = new Map()
    updates.forEach(u => {
      if (u.createdBy) {
        usersMap.set(u.createdBy.uid, u.createdBy.name || u.createdBy.email || "Unknown")
      }
    })
    return Array.from(usersMap.entries()).map(([uid, name]) => ({ uid, name }))
  }, [updates])

  // Filter updates based on selected filters
  const filteredUpdates = useMemo(() => {
    let filtered = [...updates]

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter(update => {
        if (!update.createdAt?.seconds) return false
        const updateDate = new Date(update.createdAt.seconds * 1000)
        return updateDate >= filterDate
      })
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(update => update.updateType === typeFilter)
    }

    // User filter
    if (userFilter !== "all") {
      filtered = filtered.filter(update => update.createdBy?.uid === userFilter)
    }

    return filtered
  }, [updates, dateFilter, typeFilter, userFilter])

  // Reset filters
  const handleResetFilters = () => {
    setDateFilter("all")
    setTypeFilter("all")
    setUserFilter("all")
  }

  const hasActiveFilters = dateFilter !== "all" || typeFilter !== "all" || userFilter !== "all"

  return (
    <div className="space-y-4">
      {/* Activity Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MdCheckCircle className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Activity Feed</h2>
          <span className="text-sm text-gray-500">({filteredUpdates.length} updates)</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-sm text-primary hover:text-orange-600 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Filters - Mobile */}
      <div className="md:hidden space-y-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Posted by</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user.uid} value={user.uid}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters - Desktop */}
      <div className="hidden md:grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Date Range</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Posted by</label>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user.uid} value={user.uid}>{user.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Items */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MdCheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {hasActiveFilters ? "No updates match your filters" : "No updates yet"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results" 
                : "Post an update to get started"}
            </p>
          </div>
        ) : (
          filteredUpdates.map((update) => (
            <div key={update.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
              {/* User Info */}
              <div className="flex items-start gap-3 mb-4">
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
          ))
        )}
      </div>
    </div>
  )
}