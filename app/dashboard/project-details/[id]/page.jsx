"use client"

import { useState, useEffect, useMemo } from "react"
import {
  IoChevronBack,
  IoEllipsisVertical,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoDocumentTextOutline,
  IoChatbubbleOutline,
  IoDocumentOutline,
  IoCalendarOutline,
  IoArrowForward,
} from "react-icons/io5"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useParams, useRouter } from "next/navigation"
import QuickAccess from "@/components/Dashboard/ProjectDetails/Id/QuickAccess"

// Helper functions from TimelineTab
const parseCost = (cost) => {
  if (!cost) return 0
  if (typeof cost === "number") return cost
  return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
}
const calculateBudgetSummary = (taskTimeline) => {
  const totalBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = parseCost(stage.cost)
    const tasksCost = (stage.tasks || []).reduce((s, t) => s + parseCost(t.cost), 0)
    return sum + stageCost + tasksCost
  }, 0)
  const remainingBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = stage.status !== "Completed" ? parseCost(stage.cost) : 0
    const tasksCost = (stage.tasks || []).reduce((s, t) => t.status !== "Completed" ? s + parseCost(t.cost) : s, 0)
    return sum + stageCost + tasksCost
  }, 0)
  return {
    totalBudget,
    costIncurred: totalBudget - remainingBudget,
    remainingBudget,
  }
}

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, loading } = usePersonalProjects();
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [expandedStages, setExpandedStages] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Select project by id from URL
  useEffect(() => {
    if (!loading && projects.length > 0) {
      const found = projects.find((p) => p.id === id);
      setProject(found || null);
    }
  }, [projects, loading, id])

  // Fetch timeline for the selected project
  useEffect(() => {
    const fetchTimeline = async () => {
      if (!project) return
      try {
        const projectRef = doc(db, "projects", project.id)
        const projectSnap = await getDoc(projectRef)
        if (projectSnap.exists()) {
          const data = projectSnap.data()
          setTimeline(Array.isArray(data.taskTimeline) ? data.taskTimeline : [])
        } else {
          setTimeline([])
        }
      } catch {
        setTimeline([])
      }
    }
    fetchTimeline()
  }, [project])

  // Calculate completion, current phase, and upcoming tasks
  const { percentComplete, currentPhase, completedStages } = useMemo(() => {
    if (!timeline.length) return { percentComplete: 0, currentPhase: null, completedStages: 0 }
    const completed = timeline.filter((s) => s.status === "Completed").length
    const percent = Math.round((completed / timeline.length) * 100)
    const current = timeline.find((s) => s.status !== "Completed") || timeline[timeline.length - 1]
    return { percentComplete: percent, currentPhase: current, completedStages: completed }
  }, [timeline])

  useEffect(() => {
    // Gather all tasks not completed
    const tasks = []
    timeline.forEach((stage) => {
      ;(stage.tasks || []).forEach((task) => {
        if (task.status !== "Completed") tasks.push({ ...task, stageName: stage.name })
      })
    })
    setUpcomingTasks(tasks)
  }, [timeline])

  const budgetSummary = useMemo(() => calculateBudgetSummary(timeline), [timeline])

  const toggleStage = (idx) => {
    setExpandedStages((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]))
  }

  if (loading || !project) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button & Title */}
        <div className="flex items-center justify-between mb-6 bg-white py-6 px-4">
          <button 
        //   onClick={()=> router.back()}
          className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-gray-900" onClick={() => router.push('/dashboard')}>
            <IoChevronBack />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold flex-1 text-center sm:text-left sm:ml-4">
              {project.projectName}{" "}
              {project.startDate && (
                <span className="text-base text-gray-500 font-normal ml-2">
                  ({new Date(project.startDate).toLocaleDateString()})
                </span>
              )}
            </h1>
          </div>
          <button className="p-2 cursor-pointer hover:bg-gray-100 rounded">
            <IoEllipsisVertical className="text-xl" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress & Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Progress Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#f97316"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentComplete / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-orange-500">{percentComplete}%</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">Overall Completion</p>
                </div>
                {/* Project Status */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Project Status</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Phase</p>
                      <p className="font-semibold text-gray-900">{currentPhase?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Started On</p>
                      <p className="font-semibold text-gray-900">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "-"}
                    </p>
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium">
                      <IoCheckmarkCircle />
                      <span>{percentComplete === 100 ? "Completed" : "On Schedule"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h2>
              <div className="space-y-4">
                {timeline.map((stage, idx) => (
                  <div key={stage.id || idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-6 h-6 ${
                          stage.status === "Completed"
                            ? "bg-orange-500"
                            : stage.status === "In Progress"
                            ? "border-4 border-orange-500 bg-white"
                            : "border-2 border-gray-300 bg-white"
                        } rounded-full flex items-center justify-center`}
                      >
                        {stage.status === "Completed" ? <IoCheckmarkCircle className="text-white text-sm" /> : null}
                      </div>
                      {idx < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-full ${
                            stage.status === "Completed" ? "bg-orange-500" : "bg-gray-300"
                          } mt-2`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div
                        className={`rounded-lg p-4 ${
                          stage.status === "Completed"
                            ? "bg-green-50"
                            : stage.status === "In Progress"
                            ? "bg-orange-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-1 font-medium ${
                                stage.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : stage.status === "In Progress"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {stage.status || "Upcoming"}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              {stage.dueDate && stage.dueDate.start && stage.dueDate.end
                                ? `${new Date(stage.dueDate.start).toLocaleDateString()} - ${new Date(stage.dueDate.end).toLocaleDateString()}`
                                : "-"}
                            </p>
                            <button
                              className="text-teal-600 text-sm font-medium hover:underline"
                              onClick={() => toggleStage(idx)}
                            >
                              {expandedStages.includes(idx) ? "Hide Tasks" : "View Tasks"}
                            </button>
                          </div>
                        </div>
                        {/* Expandable Tasks */}
                        {expandedStages.includes(idx) && (
                          <div className="space-y-2 mt-4">
                            {(stage.tasks || []).length === 0 && <div className="text-sm text-gray-500">No tasks for this stage.</div>}
                            {(stage.tasks || []).map((task, tIdx) => (
                              <div key={task.id || tIdx} className="flex items-center gap-2">
                                {task.status === "Completed" ? (
                                  <IoCheckmarkCircle className="text-orange-600 text-lg flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-orange-300 rounded-full flex-shrink-0"></div>
                                )}
                                <span className={`text-sm ${task.status === "Completed" ? "text-gray-700" : "text-gray-500"}`}>
                                  {task.name}
                                </span>
                                <span className="ml-auto text-xs text-gray-400">
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Budget Info */}
                        <div className="mt-4 pt-4 border-t border-orange-200 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-900">Total Budget</span>
                            <span className="font-semibold text-gray-900">₦{parseCost(stage.cost).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-900">Spent to Date</span>
                            <span className="font-semibold text-gray-900">
                              ₦{(stage.tasks || []).filter((t) => t.status === "Completed").reduce((s, t) => s + parseCost(t.cost), 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-900">Remaining</span>
                            <span className="font-semibold text-gray-900">
                              ₦{(parseCost(stage.cost) + (stage.tasks || []).reduce((s, t) => s + parseCost(t.cost), 0) - (stage.tasks || []).filter((t) => t.status === "Completed").reduce((s, t) => s + parseCost(t.cost), 0)).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoDocumentTextOutline className="text-orange-500 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Budget</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="font-semibold text-gray-900">₦{budgetSummary.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Spent to Date</span>
                  <span className="font-semibold text-gray-900">₦{budgetSummary.costIncurred.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-semibold text-gray-900">₦{budgetSummary.remainingBudget.toLocaleString()}</span>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  View Financial Details
                  <IoArrowForward className="text-xs" />
                </button>
              </div>
            </div>
            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoCalendarOutline className="text-orange-500 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              </div>
              <div className="space-y-3">
                {upcomingTasks.length === 0 && <div className="text-sm text-gray-500">No upcoming tasks.</div>}
                {upcomingTasks.map((task, idx) => (
                  <div className="flex gap-3" key={task.id || idx}>
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        {task.name}{" "}
                        <span className="text-xs text-gray-400">({task.stageName})</span>
                      </p>
                      <p className="text-xs text-gray-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Access */}
           <QuickAccess/>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-yellow-50 border-t border-yellow-100 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">© 2023 iSHELTER, a product of Everything Shelter</p>
        </div>
      </footer>
    </div>
  )
}
