"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useLiveFeed } from "@/contexts/LiveFeedContext"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"
import Header from "@/components/Dashboard/LiveFeed/Id/Headers"
import FilterTabs from "@/components/Dashboard/LiveFeed/Id/FilterTabs"
import FeedTimeline from "@/components/Dashboard/LiveFeed/Id/FeedTimeline"
import LiveFeedSection from "@/components/Dashboard/LiveFeed/Id/LiveFeedSection"
import ClientLocationView from "@/components/Dashboard/LiveFeed/Id/ClientLocationView"
import { toast } from "react-hot-toast"

export default function LiveFeedDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params["live-feed"]

  const { projects, loading: projectsLoading } = usePersonalProjects()
  const { updates, subscribeToUpdates } = useLiveFeed()

  const [projectData, setProjectData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [filteredUpdates, setFilteredUpdates] = useState([])

  // Fetch project data
  useEffect(() => {
    if (!projectId) return

    const fetchProject = async () => {
      try {
        setLoading(true)

        const projectRef = doc(db, "projects", projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
          toast.error("Project not found")
          router.push("/dashboard/live-feed")
          return
        }

        const data = projectSnap.data()
        setProjectData({ id: projectSnap.id, ...data })
        setLoading(false)
      } catch (err) {
        if (err.code === "permission-denied") {
          toast.error("You don't have access to this project")
        } else {
          toast.error("Failed to load project")
        }
        router.push("/dashboard/live-feed")
      }
    }

    fetchProject()
  }, [projectId, router])

  // Subscribe to live updates
  useEffect(() => {
    if (!projectId) return
    const unsubscribe = subscribeToUpdates(projectId)
    return () => unsubscribe && unsubscribe()
  }, [projectId, subscribeToUpdates])

  // Filter Logic
  useEffect(() => {
    const normalizeType = (type) => {
      if (!type) return "unknown"
      const t = type.toLowerCase()
      if (t.includes("image")) return "image"
      if (t.includes("video")) return "video"
      return "unknown"
    }

    let filtered = [...updates]

    // Date filter first
    if (dateFilter !== "all") {
      filtered = filterByDateRange(filtered, dateFilter)
    }

    // Content type filtering (strict)
    if (activeTab === "photos") {
      filtered = filtered.filter(
        (u) =>
          u.media &&
          u.media.length > 0 &&
          u.media.every((m) => normalizeType(m.contentType) === "image")
      )
    } else if (activeTab === "videos") {
      filtered = filtered.filter(
        (u) =>
          u.media &&
          u.media.length > 0 &&
          u.media.every((m) => normalizeType(m.contentType) === "video")
      )
    }

    setFilteredUpdates(filtered)
  }, [updates, activeTab, dateFilter])

  // Filter by date range helper
  const filterByDateRange = (updates, range) => {
    const now = new Date()
    const filterDate = new Date()

    switch (range) {
      case "today":
        filterDate.setHours(0, 0, 0, 0)
        break
      case "7days":
        filterDate.setDate(now.getDate() - 7)
        break
      case "30days":
        filterDate.setDate(now.getDate() - 30)
        break
      case "3months":
        filterDate.setMonth(now.getMonth() - 3)
        break
      case "1year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return updates
    }

    return updates.filter((update) => {
      if (!update.createdAt?.seconds) return false
      const updateDate = new Date(update.createdAt.seconds * 1000)
      return updateDate >= filterDate
    })
  }

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Project Data
          </h2>
          <p className="text-gray-600">Unable to load project information.</p>
          <button
            onClick={() => router.push("/dashboard/live-feed")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const latestVideo = updates
    .filter((u) =>
      u.media?.some((m) => m.contentType?.toLowerCase().includes("video"))
    )
    .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)[0]

  const hasLocation = !!projectData.projectLocation

  return (
    <div className="min-h-screen bg-gray-50">
      <Header projectData={projectData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          hasLocation={hasLocation}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {activeTab === "location" ? (
          <ClientLocationView projectId={projectId} projectData={projectData} />
        ) : (
          <FeedTimeline updates={filteredUpdates} />
        )}
      </main>
    </div>
  )
}
