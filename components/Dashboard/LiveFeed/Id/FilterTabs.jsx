"use client"

import { FiMapPin, FiCalendar } from "react-icons/fi"

export default function FilterTabs({ activeTab, onTabChange, hasLocation, dateFilter, onDateFilterChange }) {
  const tabs = [
    { id: "all", label: "All Updates" },
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
  ]

  // Add location tab if project has a location set
  if (hasLocation) {
    tabs.push({ id: "location", label: "Location", icon: FiMapPin })
  }

  const dateOptions = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "3months", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" },
  ]

  return (
    <div className="mb-6">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-gray-500" />
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700 min-w-[180px]"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}