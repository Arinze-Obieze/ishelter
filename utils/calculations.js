"use client"

export const parseCost = (cost) => {
  if (!cost) return 0
  if (typeof cost === "number") return cost
  return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
}

export const calculateBudgetSummary = (taskTimeline) => {
  const totalBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = parseCost(stage.cost)
    return sum + stageCost
  }, 0)

  const remainingBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = stage.status !== "Completed" ? parseCost(stage.cost) : 0
    return sum + stageCost
  }, 0)

  return {
    totalBudget,
    costIncurred: totalBudget - remainingBudget,
    remainingBudget
  }
}

// Status configuration and helpers
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