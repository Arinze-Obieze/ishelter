"use client"

import { FiPlay } from "react-icons/fi"
import { useState } from "react"

export default function LiveFeedSection({ update }) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!update || !update.media) return null

  // Get the first video from the update
  const videoMedia = update.media.find(m => m.contentType.startsWith("video"))
  
  if (!videoMedia) return null

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return "Recently"
    
    const date = new Date(timestamp.seconds * 1000)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Latest Video Update</h2>
            <p className="text-sm text-gray-500">{formatTimestamp(update.createdAt)}</p>
          </div>
          {update.updateType && (
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
              {update.updateType}
            </span>
          )}
        </div>
        {update.description && (
          <p className="text-sm text-gray-700 mt-2">{update.description}</p>
        )}
      </div>

      <div className="relative bg-gray-900">
        {!isPlaying ? (
          // Thumbnail with Play Button
          <div 
            className="relative h-64 md:h-96 lg:h-[500px] bg-gray-800 group cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <video
              src={videoMedia.url}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
              <div className="w-20 h-20 rounded-full bg-orange-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FiPlay className="w-10 h-10 text-white ml-2" fill="white" />
              </div>
            </div>
          </div>
        ) : (
          // Full Video Player
          <div className="relative h-64 md:h-96 lg:h-[500px]">
            <video
              src={videoMedia.url}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            />
          </div>
        )}
      </div>

      {/* Posted By */}
      {update.createdBy && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-orange-600">
                {update.createdBy.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {update.createdBy.name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">Posted this update</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}