"use client"

import { useState, lazy, Suspense } from "react"
import { useParams } from "next/navigation"

const OverviewTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/OverviewTab'))
const TimelineTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/TimelineTab/TimelineTab'))
const DocumentsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/documents/Documents'))
const BillsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/bills/Bills&Invoices'))
const LiveTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/LiveFeed&Updates/LiveTab'))

const TabLoadingFallback = () => (
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

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState("Overview")

  const tabs = ["Overview", "Task Timeline", "Live Feed & Updates", "Bills & Invoices", "Documents"]

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return <OverviewTab projectId={projectId} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      case "Task Timeline":
        return <TimelineTab projectId={projectId} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      case "Live Feed & Updates":
        return <LiveTab projectId={projectId} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      case "Bills & Invoices":
        return <BillsTab projectId={projectId} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      case "Documents":
        return <DocumentsTab projectId={projectId} tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      default:
        return null
    }
  }

  return (
    <Suspense fallback={<TabLoadingFallback />}>
      {renderTabContent()}
    </Suspense>
  )
}