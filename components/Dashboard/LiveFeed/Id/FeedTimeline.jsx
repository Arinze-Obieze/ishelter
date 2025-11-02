"use client"

import { AiFillClockCircle } from "react-icons/ai"
import { MdPlayArrow } from "react-icons/md"
import { useState } from "react"

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return "?"
  const parts = name.trim().split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 1).toUpperCase()
}

// Helper to format date
const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "Recently"
  
  const date = new Date(timestamp.seconds * 1000)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Reset time for comparison
  today.setHours(0, 0, 0, 0)
  yesterday.setHours(0, 0, 0, 0)
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)
  
  if (compareDate.getTime() === today.getTime()) {
    return "Today"
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

// Helper to format time
const formatTime = (timestamp) => {
  if (!timestamp?.seconds) return ""
  
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Media Viewer Modal
function MediaViewer({ media, onClose }) {
  if (!media) return null

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 z-10"
      >
        ✕
      </button>
      <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
        {media.contentType.startsWith("image") ? (
          <img
            src={media.url}
            alt={media.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  )
}

export default function FeedTimeline({ updates }) {
  const [selectedMedia, setSelectedMedia] = useState(null)

  // Group updates by date
  const groupedByDate = updates.reduce((acc, update) => {
    const dateKey = formatDate(update.createdAt)
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(update)
    return acc
  }, {})

  const dateEntries = Object.entries(groupedByDate)

  // Empty state
  if (updates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <p className="text-xl font-semibold text-gray-900 mb-2">No updates yet</p>
        <p className="text-gray-500">
          Check back later for project updates and media
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-primary"></div>

        <div className="space-y-8 relative">
          {dateEntries.map(([date, items]) => (
            <div key={date}>
              <div className="relative pl-8 mb-6">
                <div className="absolute left-0 top-0 -translate-x-1.5">
                  <div className="w-5 h-5 bg-primary rounded-full border-4 border-white shadow-md relative z-10"></div>
                </div>

                {/* Date label */}
                <p className="text-sm font-semibold text-gray-900">{date}</p>
              </div>

              <div className="space-y-6 pl-8">
                {items.map((update) => {
                  const userName = update.createdBy?.name || "project manager"
                  const userInitials = getInitials(userName)
                  const time = formatTime(update.createdAt)

                  // Separate images and videos
                  const images = update.media?.filter(m => m.contentType.startsWith("image")) || []
                  const videos = update.media?.filter(m => m.contentType.startsWith("video")) || []
                  const allMedia = [...images, ...videos]

                  return (
                    <div key={update.id} className="relative">
                      <div className="absolute -left-5 top-2 w-2.5 h-2.5 bg-primary rounded-full relative z-10 border-2 border-white"></div>

                      {/* Content */}
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                        {/* Media Display */}
                        {allMedia.length > 0 && (
                          <div className="relative">
                            {allMedia.length === 1 ? (
                              // Single media - full width (consistent with template)
                              <div className="relative">
                                {images.length === 1 ? (
                                  <img
                                    src={images[0].url}
                                    alt={update.description}
                                    className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                    onClick={() => setSelectedMedia(images[0])}
                                  />
                                ) : (
                                  <div className="relative group cursor-pointer" onClick={() => setSelectedMedia(videos[0])}>
                                    <video
                                      src={videos[0].url}
                                      className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                                        <MdPlayArrow className="w-8 h-8 text-white ml-1" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                             // Multiple media - grid
<div className={`grid gap-1 ${allMedia.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 md:px-8'}`}>
  {allMedia.slice(0, 6).map((media, idx) => (
    <div key={idx} className="relative group cursor-pointer" onClick={() => setSelectedMedia(media)}>
      {media.contentType.startsWith("image") ? (
        <img
          src={media.url}
          alt={`Media ${idx + 1}`}
          className="w-full h-32 md:h-[240px] md:w-[582px] object-cover group-hover:opacity-95 transition-opacity"
        />
      ) : (
        <>
          <video
            src={media.url}
            className="w-full h-32 md:h-[240px] md:w-[582px] object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <MdPlayArrow className="w-6 h-6 text-white ml-0.5" />
            </div>
          </div>
        </>
      )}
      {/* Show +N overlay on last item if more media exists */}
      {idx === 5 && allMedia.length > 6 && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">
            +{allMedia.length - 6}
          </span>
        </div>
      )}
    </div>
  ))}
</div>
                            )}
                            {/* Update Type Badge */}
                            {update.updateType && (
                              <div className="absolute top-3 right-3 bg-gray-800/80 text-white px-2.5 py-1 rounded text-xs font-medium backdrop-blur-sm">
                                {update.updateType}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-4">
                          {/* Time */}
                          <div className="flex items-center gap-2 mb-2">
                            <AiFillClockCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-orange-600">{time}</span>
                          </div>
                          {/* Description */}
                          <p className="text-gray-800 mb-4 whitespace-pre-wrap">{update.description}</p>
                          {/* User Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-xs font-semibold text-orange-600">{userInitials}</span>
                              </div>
                              <span className="text-sm text-gray-600">{userName}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  )
}