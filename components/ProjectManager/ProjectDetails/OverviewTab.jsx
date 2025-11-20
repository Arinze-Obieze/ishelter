import React, { useState, useEffect } from 'react'
import {
  FaComments,
} from "react-icons/fa"
import { doc, getDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import TabsNavigation from './TabsNavigation'

const OverviewTab = ({ projectId, tabs, activeTab, onTabChange }) => {
  const [projectData, setProjectData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projectUsers, setProjectUsers] = useState([])

  useEffect(() => {
    if (!projectId) return

    const unsubscribe = onSnapshot(
      doc(db, "projects", projectId),
      async (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data()
            setProjectData(data)

            if (data.projectUsers && Array.isArray(data.projectUsers)) {
              const usersData = await Promise.all(
                data.projectUsers.map(async (userRef) => {
                  try {
                    if (userRef && userRef.path) {
                      const userDoc = await getDoc(userRef)
                      if (userDoc.exists()) {
                        return {
                          id: userDoc.id,
                          ...userDoc.data()
                        }
                      }
                    }
                  } catch (err) {
                    console.error("Error fetching user:", err)
                  }
                  return null
                })
              )
              setProjectUsers(usersData.filter(user => user !== null))
            } else {
              setProjectUsers([])
            }
          } else {
            setProjectData(null)
            setProjectUsers([])
          }
          setLoading(false)
        } catch (err) {
          console.error("Error processing project data:", err)
          setError("Failed to load project data")
          setLoading(false)
        }
      },
      (err) => {
        console.error("Firestore error:", err)
        setError("Failed to fetch project data")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [projectId])

  const calculateProjectStats = () => {
    if (!projectData) {
      return {
        daysRemaining: 0,
        budgetSpentPercentage: 0,
        openTasks: 0,
        progressPercentage: 0,
        timelineProgress: 0
      }
    }

    const taskTimeline = projectData.taskTimeline || []
    
    let daysRemaining = 0
    if (projectData.completionDate) {
      const completionDate = new Date(projectData.completionDate)
      const today = new Date()
      const timeDiff = completionDate.getTime() - today.getTime()
      daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    }

    const initialBudget = parseCost(projectData.initialBudget) || 0
    const spentBudget = taskTimeline.reduce((sum, stage) => {
      const stageCost = stage.status === "Completed" ? parseCost(stage.cost) : 0
      const tasksCost = (stage.tasks || []).reduce((s, task) => 
        task.status === "Completed" ? s + parseCost(task.cost) : s, 0)
      return sum + stageCost + tasksCost
    }, 0)

    const budgetSpentPercentage = initialBudget > 0 
      ? Math.min(100, (spentBudget / initialBudget) * 100)
      : 0

    const openTasks = taskTimeline.reduce((count, stage) => {
      const pendingTasks = (stage.tasks || []).filter(task => 
        task.status !== "Completed"
      ).length
      return count + pendingTasks
    }, 0)

    const totalStages = taskTimeline.length
    const completedStages = taskTimeline.filter(stage => 
      stage.status === "Completed"
    ).length
    const progressPercentage = totalStages > 0 
      ? (completedStages / totalStages) * 100 
      : 0

    let timelineProgress = 0
    if (projectData.startDate && projectData.completionDate) {
      const startDate = new Date(projectData.startDate)
      const completionDate = new Date(projectData.completionDate)
      const today = new Date()
      
      const totalDuration = completionDate.getTime() - startDate.getTime()
      const elapsedDuration = today.getTime() - startDate.getTime()
      
      if (totalDuration > 0) {
        timelineProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100))
      }
    }

    return {
      daysRemaining: Math.max(0, daysRemaining),
      budgetSpentPercentage: Math.round(budgetSpentPercentage),
      openTasks,
      progressPercentage: Math.round(progressPercentage),
      timelineProgress: Math.round(timelineProgress)
    }
  }

  const parseCost = (cost) => {
    if (!cost) return 0
    if (typeof cost === "number") return cost
    return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getProjectPhases = () => {
    if (!projectData || !projectData.taskTimeline) return []
    
    return projectData.taskTimeline.map(stage => ({
      name: stage.name || "Unnamed Stage",
      status: stage.status || "Pending"
    }))
  }

  if (loading) {
    return (
      <div className='md:px-8 overflow-x-hidden'>
        <header className="py-4">
          <div className="bg-white px-4 py-4 md:pt-13 md:pb-5 md:px-8 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="h-8 bg-gray-200 rounded w-48 md:w-64"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-3">
              <div className="h-10 bg-gray-200 rounded w-32 md:w-40"></div>
              <div className="h-10 bg-gray-200 rounded w-28 md:w-32"></div>
            </div>
          </div>
        </header>
        <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    )
  }

  if (error) {
    return (
      <div className='md:px-8 overflow-x-hidden'>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className='md:px-8 overflow-x-hidden'>
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-gray-500 text-lg">Project not found</div>
        </div>
      </div>
    )
  }

  const stats = calculateProjectStats()
  const projectPhases = getProjectPhases()

  return (
    <div className='md:px-8 overflow-x-hidden'>
      <header className="py-4">
        <div className="bg-white px-4 py-4 md:px-8 flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 break-words">
              {projectData.projectName || "Unnamed Project"}
            </h1>
            <span className={`text-white text-xs font-semibold px-3 py-1 rounded-full w-fit ${
              projectData.projectStatus === "Completed" 
                ? "bg-green-500" 
                : projectData.projectStatus === "In Progress" 
                  ? "bg-primary" 
                  : "bg-gray-500"
            }`}>
              {projectData.projectStatus || "Not Started"}
            </span>
          </div>

        </div>
      </header>
      
      <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      
      <div className='bg-white'>
        <main className="px-4 md:px-5 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-6">
            
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 min-w-0">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200 min-w-0">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    {stats.daysRemaining}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Days Remaining</div>
                </div>

                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200 min-w-0">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stats.budgetSpentPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Budget Spent</div>
                </div>

                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200 min-w-0">
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    {stats.openTasks}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Open Tasks</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Project Progress</h2>

                <div className="mb-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${stats.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between text-sm text-gray-600 mb-6 gap-2">
                  <div>
                    <span className="font-medium">Started:</span> {formatDate(projectData.startDate)}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {stats.progressPercentage}% Complete ({stats.timelineProgress}% Timeline)
                  </div>
                  <div>
                    <span className="font-medium">Due:</span> {formatDate(projectData.completionDate)}
                  </div>
                </div>

                {projectPhases.length > 0 && (
                  <>
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Project Stages</h3>
                    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:items-start gap-4 md:gap-2">
                      {projectPhases.map((phase, index) => (
                        <div key={index} className="flex md:flex-col items-center md:items-center gap-3 md:gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              phase.status === "Completed"
                                ? "bg-green-500"
                                : phase.status === "In Progress"
                                  ? "bg-primary"
                                  : "bg-gray-300"
                            }`}
                          ></div>
                          <div className="text-center break-words">
                            <div className="font-semibold text-gray-900 text-sm">{phase.name}</div>
                            <div
                              className={`text-xs ${
                                phase.status === "Completed"
                                  ? "text-green-600"
                                  : phase.status === "In Progress"
                                    ? "text-primary"
                                    : "text-gray-400"
                              }`}
                            >
                              {phase.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="lg:w-80 w-full max-w-full">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {projectUsers.length > 1 ? "Project Contacts" : "Client Contact"}
                </h2>

                {projectUsers.length > 0 ? (
                  <div className="space-y-4">
                    {projectUsers.map((user, index) => (
                      <div key={user.id || index} className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:mb-0 last:pb-0">
                        <div className="font-semibold text-gray-900 mb-1 break-words">
                          {user.displayName || user.email || "Unknown User"}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Client"}
                        </div>
                        {user.email && (
                          <div className="text-sm text-gray-500 mb-2 break-words">
                            {user.email}
                          </div>
                        )}
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          user.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.status || "Unknown"}
                        </div>
                        
                        <button className="w-full mt-3 bg-primary hover:bg-amber-600 text-white font-medium px-4 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors">
                          <FaComments className="text-base" />
                          Start Chat
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No contacts assigned
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default OverviewTab
