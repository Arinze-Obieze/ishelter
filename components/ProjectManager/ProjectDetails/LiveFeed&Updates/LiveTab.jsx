"use client"

import { useState } from "react"
import PostUpdateForm from "./PostUpdate"
import ActivityFeed from "./ActivityFeed"
import TabsNavigation from "../TabsNavigation"
import { LiveFeedProvider } from "@/contexts/LiveFeedContext"
import ProjectLocationMap from "./ProjectLocationMap"

export default function Home({ projectId, tabs, activeTab, onTabChange }) {
  return (
    <LiveFeedProvider>
      <div className="min-h-screen bg-gray-50">
        <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

        <main className="md:max-w-7xl mx-auto px-2 md:px-2 py-6 md:py-8">
          {/* Post New Update Section */}
          <PostUpdateForm projectId={projectId} />

            {/* Project Location Map Section */}
            <ProjectLocationMap projectId={projectId} />

          {/* Activity Feed Section */}
          <ActivityFeed projectId={projectId} />
        </main>
      </div>
    </LiveFeedProvider>
  )
}
