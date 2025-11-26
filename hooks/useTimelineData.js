"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export function useTimelineData(projectId) {
  const [taskTimeline, setTaskTimeline] = useState([])
  const [expandedStages, setExpandedStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!projectId) return
    
    const fetchTimeline = async () => {
      setLoading(true)
      setError(null)
      try {
        const projectRef = doc(db, "projects", projectId)
        const projectSnap = await getDoc(projectRef)
        if (projectSnap.exists()) {
          const data = projectSnap.data()
          setTaskTimeline(Array.isArray(data.taskTimeline) ? data.taskTimeline : [])
        } else {
          setTaskTimeline([])
        }
      } catch (err) {
        setError("Failed to fetch timeline")
      } finally {
        setLoading(false)
      }
    }
    
    fetchTimeline()
  }, [projectId])

  return {
    taskTimeline,
    expandedStages,
    loading,
    error,
    setTaskTimeline,
    setExpandedStages,
    setError
  }
}


