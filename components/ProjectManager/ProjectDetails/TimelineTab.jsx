"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiTrash2, FiEye, FiChevronRight, FiChevronDown, FiPlus, FiCheck, FiX } from "react-icons/fi"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import TabsNavigation from "./TabsNavigation"
import ProjectTeam from "@/components/Dashboard/Timeline/ProjectTeam"

export default function TimelineTab({ projectId, tabs, activeTab, onTabChange }) {
  const [taskTimeline, setTaskTimeline] = useState([])
  const [expandedStages, setExpandedStages] = useState([])
  const [activeMobileTab, setActiveMobileTab] = useState("tasks")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingStage, setAddingStage] = useState(false)
  const [addingTaskStageId, setAddingTaskStageId] = useState(null)
  const [newStage, setNewStage] = useState({ name: "", dueDate: "", cost: "", status: "Pending", tasks: [] })
  const [newTask, setNewTask] = useState({ name: "", dueDate: "", cost: "", status: "Pending" })
  const [saving, setSaving] = useState(false)
  const [editingStageIdx, setEditingStageIdx] = useState(null)
  const [editingTask, setEditingTask] = useState({ stageIdx: null, taskIdx: null })
  const [editStage, setEditStage] = useState({})
  const [editTask, setEditTask] = useState({})

  // Fetch project taskTimeline from Firestore
  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    const fetchTimeline = async () => {
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

  // Expand/collapse stage
  const toggleStage = (stageIdx) => {
    setExpandedStages((prev) => prev.includes(stageIdx) ? prev.filter((i) => i !== stageIdx) : [...prev, stageIdx])
  }

  // Add new stage
  const handleAddStage = () => {
    setAddingStage(true)
    setNewStage({ name: "", dueDate: "", cost: "", status: "Pending", tasks: [] })
  }
  const handleSaveStage = async () => {
    if (!newStage.name || !newStage.dueDate || !newStage.cost) return
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline, { ...newStage, id: Date.now().toString(), tasks: [] }]
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      setAddingStage(false)
      setNewStage({ name: "", dueDate: "", cost: "", status: "Pending", tasks: [] })
    } catch (err) {
      setError("Failed to add stage")
    } finally {
      setSaving(false)
    }
  }
  const handleCancelStage = () => {
    setAddingStage(false)
    setNewStage({ name: "", dueDate: "", cost: "", status: "Pending", tasks: [] })
  }

  // Add new task under a stage
  const handleAddTask = (stageIdx) => {
    setAddingTaskStageId(stageIdx)
    setNewTask({ name: "", dueDate: "", cost: "", status: "Pending" })
  }
  const handleSaveTask = async (stageIdx) => {
    if (!newTask.name || !newTask.dueDate || !newTask.cost) return
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline]
      const stage = { ...updatedTimeline[stageIdx] }
      stage.tasks = [...(stage.tasks || []), { ...newTask, id: Date.now().toString() }]
      updatedTimeline[stageIdx] = stage
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      setAddingTaskStageId(null)
      setNewTask({ name: "", dueDate: "", cost: "", status: "Pending" })
    } catch (err) {
      setError("Failed to add task")
    } finally {
      setSaving(false)
    }
  }
  const handleCancelTask = () => {
    setAddingTaskStageId(null)
    setNewTask({ name: "", dueDate: "", cost: "", status: "Pending" })
  }

  // Delete stage
  const handleDeleteStage = async (stageIdx) => {
    if (!window.confirm("Delete this stage and all its tasks?")) return
    setSaving(true)
    try {
      const updatedTimeline = taskTimeline.filter((_, idx) => idx !== stageIdx)
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
    } catch (err) {
      setError("Failed to delete stage")
    } finally {
      setSaving(false)
    }
  }

  // Edit stage
  const handleEditStage = (stageIdx) => {
    setEditingStageIdx(stageIdx)
    setEditStage({ ...taskTimeline[stageIdx] })
  }
  const handleSaveEditStage = async (stageIdx) => {
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline]
      updatedTimeline[stageIdx] = { ...editStage }
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      setEditingStageIdx(null)
      setEditStage({})
    } catch (err) {
      setError("Failed to update stage")
    } finally {
      setSaving(false)
    }
  }
  const handleCancelEditStage = () => {
    setEditingStageIdx(null)
    setEditStage({})
  }

  // Delete task
  const handleDeleteTask = async (stageIdx, taskIdx) => {
    if (!window.confirm("Delete this task?")) return
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline]
      updatedTimeline[stageIdx].tasks = updatedTimeline[stageIdx].tasks.filter((_, idx) => idx !== taskIdx)
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
    } catch (err) {
      setError("Failed to delete task")
    } finally {
      setSaving(false)
    }
  }

  // Edit task
  const handleEditTask = (stageIdx, taskIdx) => {
    setEditingTask({ stageIdx, taskIdx })
    setEditTask({ ...taskTimeline[stageIdx].tasks[taskIdx] })
  }
  const handleSaveEditTask = async (stageIdx, taskIdx) => {
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline]
      updatedTimeline[stageIdx].tasks[taskIdx] = { ...editTask }
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      setEditingTask({ stageIdx: null, taskIdx: null })
      setEditTask({})
    } catch (err) {
      setError("Failed to update task")
    } finally {
      setSaving(false)
    }
  }
  const handleCancelEditTask = () => {
    setEditingTask({ stageIdx: null, taskIdx: null })
    setEditTask({})
  }

  // Budget calculations
  const parseCost = (cost) => {
    if (!cost) return 0
    if (typeof cost === "number") return cost
    return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
  }
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
      case "In Progress":
        return "bg-yellow-100 text-yellow-700"
      case "Completed":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Helper for date range
  const renderDateRange = (range) => {
    if (!range || !range.start || !range.end) return ""
    return `${range.start} - ${range.end}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Tabs */}
        <div className="bg-white border-b border-gray-200 flex">
          <button
            onClick={() => setActiveMobileTab("overview")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "overview" ? "text-primary border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveMobileTab("documents")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "documents" ? "text-primary border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveMobileTab("tasks")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "tasks" ? "text-primary border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Tasks & Team
          </button>
        </div>
        {/* Mobile Content */}
        <div className="p-4">
          {/* Cost Summary Card */}
          <div className="bg-orange-500 rounded-lg p-4 mb-4 text-white">
            <h2 className="text-sm font-medium mb-3">Cost Reconciliation Summary</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xl font-bold">₦{totalBudget.toLocaleString()}</div>
                <div className="text-xs opacity-90">Total Budget</div>
              </div>
              <div>
                <div className="text-xl font-bold">₦{(totalBudget - remainingBudget).toLocaleString()}</div>
                <div className="text-xs opacity-90">Cost Incurred</div>
              </div>
              <div>
                <div className="text-xl font-bold">₦{remainingBudget.toLocaleString()}</div>
                <div className="text-xs opacity-90">Remaining</div>
              </div>
            </div>
          </div>
          {/* Project Timeline Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-base font-bold mb-3">Project Timeline & Cost Management</h3>
            <div className="flex gap-2 mb-4">
              <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded text-sm" onClick={handleAddStage} disabled={addingStage || saving}>
                <FiPlus size={14} />
                Add Stage
              </button>
            </div>
            {/* Task Management */}
            <h4 className="text-sm font-semibold mb-3">Task Management</h4>
            {/* Stages and Tasks Mobile */}
            {addingStage && (
              <div className="border border-orange-200 rounded-lg mb-3 p-2 bg-orange-50">
                <input type="text" className="border rounded px-2 py-1 w-full mb-2" placeholder="Stage Name" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} />
                <div className="flex gap-2 mb-2">
                  <input type="date" className="border rounded px-2 py-1 w-full" value={newStage.dueDate?.start || ""} onChange={e => setNewStage({ ...newStage, dueDate: { ...newStage.dueDate, start: e.target.value } })} placeholder="Start Date" />
                  <input type="date" className="border rounded px-2 py-1 w-full" value={newStage.dueDate?.end || ""} onChange={e => setNewStage({ ...newStage, dueDate: { ...newStage.dueDate, end: e.target.value } })} placeholder="End Date" />
                </div>
                <input type="number" className="border rounded px-2 py-1 w-full mb-2" placeholder="Cost" value={newStage.cost} onChange={e => setNewStage({ ...newStage, cost: e.target.value })} />
                <select className="border rounded px-2 py-1 w-full mb-2" value={newStage.status} onChange={e => setNewStage({ ...newStage, status: e.target.value })}>
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="flex gap-2">
                  <button className="text-green-600" onClick={handleSaveStage} disabled={saving}><FiCheck /></button>
                  <button className="text-red-600" onClick={handleCancelStage} disabled={saving}><FiX /></button>
                </div>
              </div>
            )}
            {taskTimeline.map((stage, stageIdx) => (
              <div key={stage.id || stageIdx} className="border border-gray-200 rounded-lg mb-3">
                <div className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <button onClick={() => toggleStage(stageIdx)} className="mt-1">
                      {expandedStages.includes(stageIdx) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    </button>
                    <div className="flex-1">
                      {editingStageIdx === stageIdx ? (
                        <>
                          <input type="text" className="border rounded px-2 py-1 w-full mb-1" value={editStage.name} onChange={e => setEditStage({ ...editStage, name: e.target.value })} />
                          <div className="flex gap-2 mb-1">
                            <input type="date" className="border rounded px-2 py-1 w-full" value={editStage.dueDate?.start || ""} onChange={e => setEditStage({ ...editStage, dueDate: { ...editStage.dueDate, start: e.target.value } })} placeholder="Start Date" />
                            <input type="date" className="border rounded px-2 py-1 w-full" value={editStage.dueDate?.end || ""} onChange={e => setEditStage({ ...editStage, dueDate: { ...editStage.dueDate, end: e.target.value } })} placeholder="End Date" />
                          </div>
                          <input type="number" className="border rounded px-2 py-1 w-full mb-1" value={editStage.cost} onChange={e => setEditStage({ ...editStage, cost: e.target.value })} />
                          <select className="border rounded px-2 py-1 w-full mb-1" value={editStage.status} onChange={e => setEditStage({ ...editStage, status: e.target.value })}>
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <div className="flex gap-2 mb-1">
                            <button className="text-green-600" onClick={() => handleSaveEditStage(stageIdx)} disabled={saving}><FiCheck /></button>
                            <button className="text-red-600" onClick={handleCancelEditStage} disabled={saving}><FiX /></button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-medium text-sm mb-1">{stage.name}</div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stage.status)}`}>{stage.status}</span>
                            <span className="text-xs text-gray-500">{renderDateRange(stage.dueDate)}</span>
                            <span className="text-primary font-semibold text-sm">₦{parseCost(stage.cost).toLocaleString()}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 border border-gray-300 rounded" onClick={() => handleEditStage(stageIdx)}><FiEdit2 size={14} /></button>
                            <button className="p-1.5 border border-gray-300 rounded" onClick={() => handleDeleteStage(stageIdx)}><FiTrash2 size={14} /></button>
                            <button className="p-1.5 border border-gray-300 rounded" onClick={() => handleAddTask(stageIdx)} disabled={addingTaskStageId !== null || saving}><FiPlus size={14} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Subtasks */}
                  {expandedStages.includes(stageIdx) && (
                    <div className="ml-6 mt-3 space-y-3">
                      {addingTaskStageId === stageIdx && (
                        <div className="border-l-2 border-orange-200 pl-3 mb-2 bg-orange-50 p-2">
                          <input type="text" className="border rounded px-2 py-1 w-full mb-1" placeholder="Task Name" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
                          <div className="flex gap-2 mb-1">
                            <input type="date" className="border rounded px-2 py-1 w-full" value={newTask.dueDate?.start || ""} onChange={e => setNewTask({ ...newTask, dueDate: { ...newTask.dueDate, start: e.target.value } })} placeholder="Start Date" />
                            <input type="date" className="border rounded px-2 py-1 w-full" value={newTask.dueDate?.end || ""} onChange={e => setNewTask({ ...newTask, dueDate: { ...newTask.dueDate, end: e.target.value } })} placeholder="End Date" />
                          </div>
                          <input type="number" className="border rounded px-2 py-1 w-full mb-1" placeholder="Cost" value={newTask.cost} onChange={e => setNewTask({ ...newTask, cost: e.target.value })} />
                          <select className="border rounded px-2 py-1 w-full mb-1" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                            <option value="Pending">Pending</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <div className="flex gap-2">
                            <button className="text-green-600" onClick={() => handleSaveTask(stageIdx)} disabled={saving}><FiCheck /></button>
                            <button className="text-red-600" onClick={handleCancelTask} disabled={saving}><FiX /></button>
                          </div>
                        </div>
                      )}
                      {(stage.tasks || []).map((task, taskIdx) => (
                        <div key={task.id || taskIdx} className="border-l-2 border-gray-200 pl-3">
                          {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                            <>
                              <input type="text" className="border rounded px-2 py-1 w-full mb-1" value={editTask.name} onChange={e => setEditTask({ ...editTask, name: e.target.value })} />
                              <div className="flex gap-2 mb-1">
                                <input type="date" className="border rounded px-2 py-1 w-full" value={editTask.dueDate?.start || ""} onChange={e => setEditTask({ ...editTask, dueDate: { ...editTask.dueDate, start: e.target.value } })} placeholder="Start Date" />
                                <input type="date" className="border rounded px-2 py-1 w-full" value={editTask.dueDate?.end || ""} onChange={e => setEditTask({ ...editTask, dueDate: { ...editTask.dueDate, end: e.target.value } })} placeholder="End Date" />
                              </div>
                              <input type="number" className="border rounded px-2 py-1 w-full mb-1" value={editTask.cost} onChange={e => setEditTask({ ...editTask, cost: e.target.value })} />
                              <select className="border rounded px-2 py-1 w-full mb-1" value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })}>
                                <option value="Pending">Pending</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <div className="flex gap-2 mb-1">
                                <button className="text-green-600" onClick={() => handleSaveEditTask(stageIdx, taskIdx)} disabled={saving}><FiCheck /></button>
                                <button className="text-red-600" onClick={handleCancelEditTask} disabled={saving}><FiX /></button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-medium text-sm mb-1">{task.name}</div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                                <span className="text-xs text-gray-500">{renderDateRange(task.dueDate)}</span>
                                <span className="text-primary font-semibold text-sm">₦{parseCost(task.cost).toLocaleString()}</span>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-1.5 border border-gray-300 rounded" onClick={() => handleEditTask(stageIdx, taskIdx)}><FiEdit2 size={14} /></button>
                                <button className="p-1.5 border border-gray-300 rounded" onClick={() => handleDeleteTask(stageIdx, taskIdx)}><FiTrash2 size={14} /></button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Desktop View */}
      <div className="hidden lg:flex lg:flex-[3] ">
        <div className="flex flex-1 gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Cost Summary Header */}
            <div className="bg-orange-500 text-white p-6 mx-6 mt-6 rounded-lg">
              <h2 className="text-sm font-medium mb-4">Cost Reconciliation Summary</h2>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-1">₦{totalBudget.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Budget</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">₦{(totalBudget - remainingBudget).toLocaleString()}</div>
                  <div className="text-sm opacity-90">Spent</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">₦{remainingBudget.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Remaining</div>
                </div>
              </div>
            </div>
            {/* Navigation Tabs */}
            <div className="mb-6 mt-8">
              <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
            </div>
            {/* Main Content */}
            <div className="flex gap-6 mx-6 mt-6">
              {/* Left Content */}
              <div className="flex-1 bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Project Timeline & Cost Management</h3>
                  <div className="flex gap-2 [&>*]:cursor-pointer">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm" onClick={handleAddStage} disabled={addingStage || saving}>
                      <FiPlus size={16} />
                      Add New Stage
                    </button>
                  </div>
                </div>
                {/* Task Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Stage/Task Name</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Due Date</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Cost (NGN)</th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Add Stage Row */}
                      {addingStage && (
                        <tr className="bg-orange-50">
                          <td className="py-2 px-2">
                            <input type="text" className="border rounded px-2 py-1 w-full" placeholder="Stage Name" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} />
                          </td>
                          <td className="py-2 px-2">
                            <select className="border rounded px-2 py-1 w-full" value={newStage.status} onChange={e => setNewStage({ ...newStage, status: e.target.value })}>
                              <option value="Pending">Pending</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex gap-2">
                              <input type="date" className="border rounded px-2 py-1 w-full" value={newStage.dueDate?.start || ""} onChange={e => setNewStage({ ...newStage, dueDate: { ...newStage.dueDate, start: e.target.value } })} placeholder="Start Date" />
                              <input type="date" className="border rounded px-2 py-1 w-full" value={newStage.dueDate?.end || ""} onChange={e => setNewStage({ ...newStage, dueDate: { ...newStage.dueDate, end: e.target.value } })} placeholder="End Date" />
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <input type="number" className="border rounded px-2 py-1 w-full" placeholder="Cost" value={newStage.cost} onChange={e => setNewStage({ ...newStage, cost: e.target.value })} />
                          </td>
                          <td className="py-2 px-2 flex gap-2">
                            <button className="text-green-600" onClick={handleSaveStage} disabled={saving}><FiCheck /></button>
                            <button className="text-red-600" onClick={handleCancelStage} disabled={saving}><FiX /></button>
                          </td>
                        </tr>
                      )}
                      {/* Stages and Tasks */}
                      {taskTimeline.map((stage, stageIdx) => (
                        <>
                          <tr key={stage.id || stageIdx} className="border-b border-gray-100">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <button onClick={() => toggleStage(stageIdx)}>
                                  {expandedStages.includes(stageIdx) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                                </button>
                                {editingStageIdx === stageIdx ? (
                                  <input type="text" className="border rounded px-2 py-1 w-full" value={editStage.name} onChange={e => setEditStage({ ...editStage, name: e.target.value })} />
                                ) : (
                                  <span className="text-sm font-medium">{stage.name}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              {editingStageIdx === stageIdx ? (
                                <select className="border rounded px-2 py-1 w-full" value={editStage.status} onChange={e => setEditStage({ ...editStage, status: e.target.value })}>
                                  <option value="Pending">Pending</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              ) : (
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stage.status)}`}>{stage.status}</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">
                              {editingStageIdx === stageIdx ? (
                                <div className="flex gap-2">
                                  <input type="date" className="border rounded px-2 py-1 w-full" value={editStage.dueDate?.start || ""} onChange={e => setEditStage({ ...editStage, dueDate: { ...editStage.dueDate, start: e.target.value } })} placeholder="Start Date" />
                                  <input type="date" className="border rounded px-2 py-1 w-full" value={editStage.dueDate?.end || ""} onChange={e => setEditStage({ ...editStage, dueDate: { ...editStage.dueDate, end: e.target.value } })} placeholder="End Date" />
                                </div>
                              ) : (
                                renderDateRange(stage.dueDate)
                              )}
                            </td>
                            <td className="py-3 px-2 text-sm font-semibold text-primary">
                              {editingStageIdx === stageIdx ? (
                                <input type="number" className="border rounded px-2 py-1 w-full" value={editStage.cost} onChange={e => setEditStage({ ...editStage, cost: e.target.value })} />
                              ) : (
                                <>₦{parseCost(stage.cost).toLocaleString()}</>
                              )}
                            </td>
                            <td className="py-3 px-2 flex gap-2">
                              {editingStageIdx === stageIdx ? (
                                <>
                                  <button className="text-green-600" onClick={() => handleSaveEditStage(stageIdx)} disabled={saving}><FiCheck /></button>
                                  <button className="text-red-600" onClick={handleCancelEditStage} disabled={saving}><FiX /></button>
                                </>
                              ) : (
                                <>
                                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleEditStage(stageIdx)}><FiEdit2 size={16} className="text-gray-600" /></button>
                                  <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleDeleteStage(stageIdx)}><FiTrash2 size={16} className="text-gray-600" /></button>
                                  <button className="flex items-center gap-1 text-xs text-orange-600" onClick={() => handleAddTask(stageIdx)} disabled={addingTaskStageId !== null || saving}><FiPlus /> Add Task</button>
                                </>
                              )}
                            </td>
                          </tr>
                          {/* Add Task Row */}
                          {addingTaskStageId === stageIdx && (
                            <tr className="bg-orange-50">
                              <td className="py-2 px-2 pl-10">
                                <input type="text" className="border rounded px-2 py-1 w-full" placeholder="Task Name" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
                              </td>
                              <td className="py-2 px-2">
                                <select className="border rounded px-2 py-1 w-full" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                                  <option value="Pending">Pending</option>
                                  <option value="Ongoing">Ongoing</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </td>
                              <td className="py-2 px-2">
                                <div className="flex gap-2">
                                  <input type="date" className="border rounded px-2 py-1 w-full" value={newTask.dueDate?.start || ""} onChange={e => setNewTask({ ...newTask, dueDate: { ...newTask.dueDate, start: e.target.value } })} placeholder="Start Date" />
                                  <input type="date" className="border rounded px-2 py-1 w-full" value={newTask.dueDate?.end || ""} onChange={e => setNewTask({ ...newTask, dueDate: { ...newTask.dueDate, end: e.target.value } })} placeholder="End Date" />
                                </div>
                              </td>
                              <td className="py-2 px-2">
                                <input type="number" className="border rounded px-2 py-1 w-full" placeholder="Cost" value={newTask.cost} onChange={e => setNewTask({ ...newTask, cost: e.target.value })} />
                              </td>
                              <td className="py-2 px-2 flex gap-2">
                                <button className="text-green-600" onClick={() => handleSaveTask(stageIdx)} disabled={saving}><FiCheck /></button>
                                <button className="text-red-600" onClick={handleCancelTask} disabled={saving}><FiX /></button>
                              </td>
                            </tr>
                          )}
                          {/* Tasks */}
                          {expandedStages.includes(stageIdx) && (stage.tasks || []).map((task, taskIdx) => (
                            <tr key={task.id || taskIdx} className="border-b border-gray-100 bg-gray-50">
                              <td className="py-3 px-2 pl-10">
                                {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                                  <input type="text" className="border rounded px-2 py-1 w-full" value={editTask.name} onChange={e => setEditTask({ ...editTask, name: e.target.value })} />
                                ) : (
                                  <span className="text-sm text-gray-700">{task.name}</span>
                                )}
                              </td>
                              <td className="py-3 px-2">
                                {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                                  <select className="border rounded px-2 py-1 w-full" value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })}>
                                    <option value="Pending">Pending</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                  </select>
                                ) : (
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
                                )}
                              </td>
                              <td className="py-3 px-2 text-sm text-gray-600">
                                {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                                  <div className="flex gap-2">
                                    <input type="date" className="border rounded px-2 py-1 w-full" value={editTask.dueDate?.start || ""} onChange={e => setEditTask({ ...editTask, dueDate: { ...editTask.dueDate, start: e.target.value } })} placeholder="Start Date" />
                                    <input type="date" className="border rounded px-2 py-1 w-full" value={editTask.dueDate?.end || ""} onChange={e => setEditTask({ ...editTask, dueDate: { ...editTask.dueDate, end: e.target.value } })} placeholder="End Date" />
                                  </div>
                                ) : (
                                  renderDateRange(task.dueDate)
                                )}
                              </td>
                              <td className="py-3 px-2 text-sm font-semibold text-primary">
                                {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                                  <input type="number" className="border rounded px-2 py-1 w-full" value={editTask.cost} onChange={e => setEditTask({ ...editTask, cost: e.target.value })} />
                                ) : (
                                  <>₦{parseCost(task.cost).toLocaleString()}</>
                                )}
                              </td>
                              <td className="py-3 px-2 flex gap-2">
                                {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
                                  <>
                                    <button className="text-green-600" onClick={() => handleSaveEditTask(stageIdx, taskIdx)} disabled={saving}><FiCheck /></button>
                                    <button className="text-red-600" onClick={handleCancelEditTask} disabled={saving}><FiX /></button>
                                  </>
                                ) : (
                                  <>
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleEditTask(stageIdx, taskIdx)}><FiEdit2 size={16} className="text-gray-600" /></button>
                                    <button className="p-1 hover:bg-gray-100 rounded" onClick={() => handleDeleteTask(stageIdx, taskIdx)}><FiTrash2 size={16} className="text-gray-600" /></button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>            
            </div>
          </div>
        </div>
        {/* Right Sidebar - Project Team */}
        <ProjectTeam/>
      </div>
    </div>
  )
}