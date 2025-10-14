"use client"

import { useState, lazy, Suspense } from "react"
import TabsNavigation from "@/components/ProjectManager/ProjectDetails/TabsNavigation"

// Lazy load tab components
const OverviewTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/OverviewTab'))
const TimelineTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/TimelineTab'))
const DocumentsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/Documents'))
const TeamTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/Bills&Invoices'))
const SettingsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/LiveTab'))

export default function ProjectPage() {
  const [activeTab, setActiveTab] = useState("Documents")

  const tabs = ["Overview", "Timeline", "Documents", "Team", "Settings"]

  const renderTabContent = () => {
    const loadingFallback = (
      <div className="animate-pulse bg-white rounded-lg shadow p-8">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )

    switch (activeTab) {
      case "Overview":
        return <Suspense fallback={loadingFallback}><OverviewTab /></Suspense>
      case "Timeline":
        return <Suspense fallback={loadingFallback}><TimelineTab /></Suspense>
      case "Documents":
        return <Suspense fallback={loadingFallback}><DocumentsTab /></Suspense>
      case "Team":
        return <Suspense fallback={loadingFallback}><TeamTab /></Suspense>
      case "Settings":
        return <Suspense fallback={loadingFallback}><SettingsTab /></Suspense>
      default:
        return <Suspense fallback={loadingFallback}><DocumentsTab /></Suspense>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <TabsNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-full overflow-x-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}