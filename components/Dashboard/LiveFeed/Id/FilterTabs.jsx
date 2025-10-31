"use client"

import { useState } from "react"
import { AiFillCalendar } from "react-icons/ai"

export default function FilterTabs() {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-2 flex-wrap">
        {[
          { id: "all", label: "All Updates" },
          { id: "photos", label: "Photos" },
          { id: "videos", label: "Videos" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              activeTab === tab.id ? "bg-orange-500 text-white" : "bg-gray-200 text-foreground hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-foreground">
        <AiFillCalendar className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium">Filter by date</span>
      </button>
    </div>
  )
}
