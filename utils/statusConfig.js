"use client"

export const STATUS_CONFIG = {
  "Pending": { color: "bg-gray-100 text-gray-600" },
  "Ongoing": { color: "bg-yellow-100 text-yellow-700" },
  "In Progress": { color: "bg-yellow-100 text-yellow-700" },
  "Completed": { color: "bg-green-100 text-green-700" }
}

export const getStatusColor = (status) => {
  return STATUS_CONFIG[status]?.color || STATUS_CONFIG.Pending.color
}

export const renderDateRange = (range) => {
  if (!range || !range.start || !range.end) return ""
  return `${range.start} - ${range.end}`
}