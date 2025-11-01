"use client"

import { useEffect, useState } from "react"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import ProjectCard from "./Card"

export default function ProjectsGrid() {
  const { projects, loading: projectsLoading } = usePersonalProjects()
  const [enrichedProjects, setEnrichedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (projectsLoading) return

    const enrichProjectsData = async () => {
      setLoading(true)
      
      try {
        const enrichedData = await Promise.all(
          projects.map(async (project) => {
            try {
              // Fetch full project document
              const projectRef = doc(db, "projects", project.id)
              const projectSnap = await getDoc(projectRef)
              
              if (!projectSnap.exists()) {
                return createFallbackProject(project)
              }

              const projectData = projectSnap.data()
              
              // Get update count from liveFeedRefs
              const updateCount = projectData.liveFeedRefs?.length || 0
              
              // Get latest update details
              let latestUpdate = null
              let latestDescription = project.shortDescription || "No updates yet"
              let timestamp = "No recent activity"
              
              if (updateCount > 0 && projectData.liveFeedRefs) {
                const latestRef = projectData.liveFeedRefs[projectData.liveFeedRefs.length - 1]
                try {
                  const updateSnap = await getDoc(latestRef)
                  if (updateSnap.exists()) {
                    latestUpdate = updateSnap.data()
                    latestDescription = latestUpdate.description || latestDescription
                    timestamp = formatTimestamp(latestUpdate.createdAt)
                  }
                } catch (err) {
                  console.error("Error fetching latest update:", err)
                }
              }

              // Calculate progress from timeline
              const progress = calculateProgress(projectData.taskTimeline)
              
              // Get project image
              const image = getProjectImage(projectData, latestUpdate)

              return {
                id: project.id,
                title: project.projectName || "Untitled Project",
                location: projectData.projectAddress || project.projectAddress || "Location not set",
                image: image,
                description: latestDescription,
                timestamp: timestamp,
                updateCount: updateCount,
                progress: progress,
                button: updateCount > 0 ? "View Live Feed" : "View Project Details",
                isComingSoon: updateCount === 0,
                hasLocation: !!projectData.projectLocation
              }
            } catch (err) {
              console.error(`Error enriching project ${project.id}:`, err)
              return createFallbackProject(project)
            }
          })
        )

        setEnrichedProjects(enrichedData)
      } catch (err) {
        console.error("Error enriching projects:", err)
      } finally {
        setLoading(false)
      }
    }

    enrichProjectsData()
  }, [projects, projectsLoading])

  // Helper: Create fallback project data
  const createFallbackProject = (project) => ({
    id: project.id,
    title: project.projectName || "Untitled Project",
    location: project.projectAddress || "Location not set",
    image: "/construction-site-with-wooden-frames.jpg",
    description: project.shortDescription || "Project details loading...",
    timestamp: "Recently",
    updateCount: 0,
    progress: 0,
    button: "View Project Details",
    isComingSoon: true,
    hasLocation: false
  })

  // Helper: Format timestamp
  const formatTimestamp = (createdAt) => {
    if (!createdAt?.seconds) return "Recently"
    
    const updateDate = new Date(createdAt.seconds * 1000)
    const now = new Date()
    const diffTime = Math.abs(now - updateDate)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return `Today at ${updateDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays === 1) {
      return `Yesterday at ${updateDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`
    } else {
      return updateDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
  }

  // Helper: Calculate progress
  const calculateProgress = (taskTimeline) => {
    if (!taskTimeline || !Array.isArray(taskTimeline) || taskTimeline.length === 0) {
      return 0
    }
    
    const completed = taskTimeline.filter(stage => stage.status === "Completed").length
    return Math.round((completed / taskTimeline.length) * 100)
  }

  // Helper: Get project image
  const getProjectImage = (projectData, latestUpdate) => {
    // Priority: Project image > Latest update media > Default
    if (projectData.projectImage) {
      return projectData.projectImage
    }
    
    if (latestUpdate?.media && latestUpdate.media.length > 0) {
      const firstMedia = latestUpdate.media[0]
      if (firstMedia.contentType?.startsWith("image")) {
        return firstMedia.url
      }
    }
    
    return "/construction-site-with-wooden-frames.jpg"
  }

  // Loading state
  if (loading || projectsLoading) {
    return (
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 md:text-xl font-bold text-gray-900 md:mb-12 text-md">
          Your Projects, Live
        </h1>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg md:h-56"></div>
              <div className="p-6 bg-white rounded-b-lg shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (enrichedProjects.length === 0) {
    return (
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 md:mb-12 md:text-4xl">
          Your Projects, Live
        </h1>
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🏗️</div>
          <p className="text-xl font-semibold text-gray-900 mb-2">No projects assigned yet</p>
          <p className="text-gray-500">
            Projects assigned to you by your project manager will appear here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Title */}
      <h1 className="mb-8 text-3xl font-bold text-gray-900 md:mb-12 md:text-4xl">
        Your Projects, Live
      </h1>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {enrichedProjects.map((project) => (
          <Link key={project.id} href={`/dashboard/live-feed/${project.id}`}>
            <ProjectCard project={project} />
          </Link>
        ))}
      </div>
    </div>
  )
}