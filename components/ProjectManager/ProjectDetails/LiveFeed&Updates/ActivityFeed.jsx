"use client"

import { useState, useEffect, useMemo } from "react"
import { MdCheckCircle, MdEdit, MdDelete, MdClose } from "react-icons/md"
import { FiUpload, FiX } from "react-icons/fi"
import { useLiveFeed } from "@/contexts/LiveFeedContext"

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

// Helper function to generate consistent color from name
const getColorFromName = (name) => {
  if (!name) return "bg-gray-400"
  
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-teal-500",
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Edit Modal Component
function EditUpdateModal({ update, onClose, onSave, existingTypes, projectId }) {
  const [description, setDescription] = useState(update.description)
  const [updateType, setUpdateType] = useState(update.updateType)
  const [customType, setCustomType] = useState("")
  const [showCustomType, setShowCustomType] = useState(false)
  const [existingMedia, setExistingMedia] = useState(update.media || [])
  const [newFiles, setNewFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const { uploadFiles, loading } = useLiveFeed()

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
    const invalidFiles = selectedFiles.filter(f => !validTypes.includes(f.type))
    
    if (invalidFiles.length > 0) {
      alert(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    setNewFiles([...newFiles, ...selectedFiles])
    setUploadProgress([...uploadProgress, ...Array(selectedFiles.length).fill(0)])
  }

  const removeExistingMedia = (index) => {
    setExistingMedia(existingMedia.filter((_, i) => i !== index))
  }

  const removeNewFile = (index) => {
    setNewFiles(newFiles.filter((_, i) => i !== index))
    setUploadProgress(uploadProgress.filter((_, i) => i !== index))
  }

  const handleTypeChange = (e) => {
    const value = e.target.value
    if (value === "__add_new__") {
      setShowCustomType(true)
      setUpdateType("")
    } else {
      setShowCustomType(false)
      setUpdateType(value)
      setCustomType("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const finalType = showCustomType ? customType.trim() : updateType
    
    if (!description.trim()) {
      alert("Please enter an update description")
      return
    }
    
    if (!finalType) {
      alert("Please select or enter an update type")
      return
    }

    if (showCustomType) {
      const typeExists = existingTypes.some(
        t => t.toLowerCase() === finalType.toLowerCase()
      )
      if (typeExists) {
        alert("This update type already exists. Please select it from the dropdown.")
        return
      }
    }

    try {
      let allMedia = [...existingMedia]
      
      if (newFiles.length > 0) {
        const uploaded = await uploadFiles(newFiles, projectId, (idx, prog) => {
          setUploadProgress(prev => {
            const next = [...prev]
            next[idx] = prog
            return next
          })
        })
        allMedia = [...allMedia, ...uploaded]
      }

      await onSave({
        description: description.trim(),
        updateType: finalType,
        media: allMedia
      })

      onClose()
    } catch (err) {
      console.error("Edit error:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Edit Update</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter update description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Update Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Type <span className="text-red-500">*</span>
            </label>
            
            {!showCustomType ? (
              <select
                value={updateType}
                onChange={handleTypeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                disabled={loading}
              >
                <option value="">Select update type...</option>
                {existingTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
                <option value="__add_new__" className="font-semibold text-primary">
                  + Add New Type
                </option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Enter new update type..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  disabled={loading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomType(false)
                    setCustomType("")
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Existing Media */}
          {existingMedia.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Media</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingMedia.map((media, idx) => (
                  <div key={idx} className="relative border rounded-lg p-2 bg-gray-50">
                    {media.contentType.startsWith("image") ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600">Video</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingMedia(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={loading}
                    >
                      <FiX size={14} />
                    </button>
                    <div className="mt-1 text-xs text-gray-600 truncate">{media.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Media (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg,image/gif,video/mp4,video/quicktime,video/webm"
              onChange={handleFileChange}
              className="hidden"
              id="edit-file-upload"
              disabled={loading}
            />
            <label
              htmlFor="edit-file-upload"
              className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 text-center flex flex-col items-center justify-center hover:border-primary transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiUpload className="w-6 h-6 text-gray-400 mb-1" />
              <p className="text-xs text-gray-600">Click to add more files</p>
            </label>
            
            {newFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {newFiles.map((file, idx) => (
                  <div key={idx} className="relative border rounded-lg p-2 bg-gray-50">
                    {file.type.startsWith("image") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-600">Video</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={loading}
                    >
                      <FiX size={14} />
                    </button>
                    <div className="mt-1 text-xs text-gray-600 truncate">{file.name}</div>
                    {uploadProgress[idx] > 0 && uploadProgress[idx] < 1 && (
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all"
                          style={{ width: `${uploadProgress[idx] * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ActivityFeed({ projectId }) {
  const { updates, subscribeToUpdates, deleteUpdate, getUpdateTypes } = useLiveFeed()
  const [expandedComments, setExpandedComments] = useState([])
  const [editingUpdate, setEditingUpdate] = useState(null)
  const [existingTypes, setExistingTypes] = useState([])
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")

  useEffect(() => {
    const unsub = subscribeToUpdates(projectId)
    return () => unsub && unsub()
  }, [projectId, subscribeToUpdates])

  useEffect(() => {
    const fetchTypes = async () => {
      const types = await getUpdateTypes(projectId)
      setExistingTypes(types)
    }
    fetchTypes()
  }, [projectId, getUpdateTypes, updates])

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

  const handleEdit = (update) => {
    setEditingUpdate(update)
  }

  const handleSaveEdit = async (updatedData) => {
    try {
      const { updateDoc, doc } = await import("firebase/firestore")
      const { db } = await import("@/lib/firebase")
      
      const updateDocRef = doc(db, "liveUpdates", editingUpdate.id)
      
      // If update type changed, handle count updates
      if (updatedData.updateType !== editingUpdate.updateType) {
        const { increment, deleteField } = await import("firebase/firestore")
        const projectDocRef = doc(db, "projects", projectId)
        
        // Decrement old type, increment new type
        await updateDoc(projectDocRef, {
          [`updateTypeCounts.${editingUpdate.updateType}`]: increment(-1),
          [`updateTypeCounts.${updatedData.updateType}`]: increment(1)
        })
        
        // Check if old type count is 0 and remove if needed
        const { getDoc } = await import("firebase/firestore")
        const projectSnap = await getDoc(projectDocRef)
        const counts = projectSnap.data()?.updateTypeCounts || {}
        if (counts[editingUpdate.updateType] === 0) {
          await updateDoc(projectDocRef, {
            [`updateTypeCounts.${editingUpdate.updateType}`]: deleteField()
          })
        }
      }
      
      await updateDoc(updateDocRef, {
        description: updatedData.description,
        updateType: updatedData.updateType,
        media: updatedData.media
      })
      
      setEditingUpdate(null)
    } catch (err) {
      console.error("Error updating:", err)
      alert("Failed to update. Please try again.")
    }
  }

  const handleDelete = async (update) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      await deleteUpdate(update.id, projectId, update.updateType)
    }
  }

  const hasActiveFilters = dateFilter !== "all" || typeFilter !== "all" || userFilter !== "all"

  return (
    <div className="space-y-4">
      {/* Edit Modal */}
      {editingUpdate && (
        <EditUpdateModal
          update={editingUpdate}
          onClose={() => setEditingUpdate(null)}
          onSave={handleSaveEdit}
          existingTypes={existingTypes}
          projectId={projectId}
        />
      )}

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
          filteredUpdates.map((update) => {
            const userName = update.createdBy?.name || "Unknown User"
            const userInitials = getInitials(userName)
            const avatarColor = getColorFromName(userName)
            
            return (
              <div key={update.id} className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                {/* Header with User Info and Action Buttons */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  {/* User Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar with Initials */}
                    <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                      {userInitials}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {userName}
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(update)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                      title="Edit update"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(update)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete update"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
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
          })
        )}
      </div>
    </div>
  )
}