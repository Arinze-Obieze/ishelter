"use client"

import { AiFillCalendar } from "react-icons/ai"
import { FiMapPin } from "react-icons/fi"

export default function FilterTabs({ activeTab, onTabChange, hasLocation }) {
  const tabs = [
    { id: "all", label: "All Updates" },
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
  ]

  // Add location tab if project has a location set
  if (hasLocation) {
    tabs.push({ id: "location", label: "Location", icon: FiMapPin })
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === tab.id 
                ? "bg-orange-500 text-white" 
                : "bg-gray-200 text-foreground hover:bg-gray-300"
            }`}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}