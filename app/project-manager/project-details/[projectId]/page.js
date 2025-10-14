"use client"

import { useState, lazy, Suspense } from "react"
import { useParams } from "next/navigation"

const OverviewTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/OverviewTab'))
const TimelineTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/TimelineTab'))
const DocumentsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/documents/Documents'))
const BillsTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/Bills&Invoices'))
const LiveTab = lazy(() => import('@/components/ProjectManager/ProjectDetails/LiveTab'))

const TabLoadingFallback = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-8">Loading...</div>
)

export default function ProjectDetailsPage() {
  const { projectId } = useParams()
  const [activeTab, setActiveTab] = useState("Overview")

  const tabs = ["Overview", "Task Timeline", "Live Feed & Updates", "Bills & Invoices",  "Documents"]

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
