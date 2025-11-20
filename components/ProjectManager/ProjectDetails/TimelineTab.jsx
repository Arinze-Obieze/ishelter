"use client"

import { useState, useEffect } from "react"
import { FiEdit2, FiTrash2, FiEye, FiChevronRight, FiChevronDown, FiPlus, FiCheck, FiX } from "react-icons/fi"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import TabsNavigation from "./TabsNavigation"
import ProjectTeam from "@/components/ProjectManager/ProjectDetails/ProjectTeam"

// Constants and configuration
const STATUS_CONFIG = {
  "Pending": { color: "bg-gray-100 text-gray-600" },
  "Ongoing": { color: "bg-yellow-100 text-yellow-700" },
  "In Progress": { color: "bg-yellow-100 text-yellow-700" },
  "Completed": { color: "bg-green-100 text-green-700" }
}

const DEFAULT_STAGE = {
  name: "",
  dueDate: "",
  cost: "",
  status: "Pending",
  tasks: []
}

const DEFAULT_TASK = {
  name: "",
  dueDate: "",
  cost: "",
  status: "Pending"
}

// Helper functions
const parseCost = (cost) => {
  if (!cost) return 0
  if (typeof cost === "number") return cost
  return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
}

const getStatusColor = (status) => {
  return STATUS_CONFIG[status]?.color || STATUS_CONFIG.Pending.color
}

const renderDateRange = (range) => {
  if (!range || !range.start || !range.end) return ""
  return `${range.start} - ${range.end}`
}

// Cost calculation mapper
const calculateBudgetSummary = (taskTimeline) => {
  const totalBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = parseCost(stage.cost)
    const tasksCost = (stage.tasks || []).reduce((s, t) => s + parseCost(t.cost), 0)
    return sum + stageCost + tasksCost
  }, 0)

  const remainingBudget = taskTimeline.reduce((sum, stage) => {
    const stageCost = stage.status !== "Completed" ? parseCost(stage.cost) : 0
    const tasksCost = (stage.tasks || []).reduce((s, t) => 
      t.status !== "Completed" ? s + parseCost(t.cost) : s, 0)
    return sum + stageCost + tasksCost
  }, 0)

  return {
    totalBudget,
    costIncurred: totalBudget - remainingBudget,
    remainingBudget
  }
}

export default function TimelineTab({ projectId, tabs, activeTab, onTabChange }) {
  const [taskTimeline, setTaskTimeline] = useState([])
  const [expandedStages, setExpandedStages] = useState([])
  const [activeMobileTab, setActiveMobileTab] = useState("tasks")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingStage, setAddingStage] = useState(false)
  const [addingTaskStageId, setAddingTaskStageId] = useState(null)
  const [newStage, setNewStage] = useState(DEFAULT_STAGE)
  const [newTask, setNewTask] = useState(DEFAULT_TASK)
  const [saving, setSaving] = useState(false)
  const [editingStageIdx, setEditingStageIdx] = useState(null)
  const [editingTask, setEditingTask] = useState({ stageIdx: null, taskIdx: null })
  const [editStage, setEditStage] = useState({})
  const [editTask, setEditTask] = useState({})

  // Calculate budget summary
  const budgetSummary = calculateBudgetSummary(taskTimeline)

  // Fetch project taskTimeline from Firestore
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

  // Stage handlers
  const toggleStage = (stageIdx) => {
    setExpandedStages((prev) => 
      prev.includes(stageIdx) 
        ? prev.filter((i) => i !== stageIdx) 
        : [...prev, stageIdx]
    )
  }

  const handleAddStage = () => {
    setAddingStage(true)
    setNewStage(DEFAULT_STAGE)
  }

  const handleSaveStage = async () => {
    if (!newStage.name || !newStage.dueDate || !newStage.cost) return
    
    setSaving(true)
    try {
      const updatedTimeline = [...taskTimeline, { 
        ...newStage, 
        id: Date.now().toString(), 
        tasks: [] 
      }]
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      setAddingStage(false)
      setNewStage(DEFAULT_STAGE)
    } catch (err) {
      setError("Failed to add stage")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelStage = () => {
    setAddingStage(false)
    setNewStage(DEFAULT_STAGE)
  }

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

  // Task handlers
  const handleAddTask = (stageIdx) => {
    setAddingTaskStageId(stageIdx)
    setNewTask(DEFAULT_TASK)
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
      setNewTask(DEFAULT_TASK)
    } catch (err) {
      setError("Failed to add task")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelTask = () => {
    setAddingTaskStageId(null)
    setNewTask(DEFAULT_TASK)
  }

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

  // Cost Reconciliation Summary Component
  const CostSummary = ({ budgetSummary, isMobile = false }) => (
    <div className={`bg-amber-500 rounded-lg p-4 ${isMobile ? 'mb-4' : 'p-6 mx-6 mt-6'} text-white`}>
      <h2 className="text-sm font-medium mb-3">Cost Reconciliation Summary</h2>
      <div className={`grid ${isMobile ? 'grid-cols-3 gap-3' : 'grid-cols-3 gap-8'}`}>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.totalBudget.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">Total Budget</div>
        </div>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.costIncurred.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">{isMobile ? 'Cost Incurred' : 'Spent'}</div>
        </div>
        <div>
          <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold ${isMobile ? 'mb-0' : 'mb-1'}`}>
            ₦{budgetSummary.remainingBudget.toLocaleString()}
          </div>
          <div className="text-xs opacity-90">Remaining</div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Tabs */}
        <div className="bg-white border-b border-gray-200 flex">
                      <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        </div>
        
        {/* Mobile Content */}
        <div className="p-4">
          <CostSummary budgetSummary={budgetSummary} isMobile={true} />
          
          {/* Project Timeline Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-base font-bold mb-3">Project Timeline & Cost Management</h3>
            <div className="flex gap-2 mb-4">
              <button 
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded text-sm" 
                onClick={handleAddStage} 
                disabled={addingStage || saving}
              >
                <FiPlus size={14} />
                Add Stage
              </button>
            </div>
            
            <h4 className="text-sm font-semibold mb-3">Task Management</h4>
            
            {/* Stages and Tasks Mobile */}
            {addingStage && (
              <StageForm
                stage={newStage}
                onChange={setNewStage}
                onSave={handleSaveStage}
                onCancel={handleCancelStage}
                saving={saving}
                isMobile={true}
              />
            )}
            
            {taskTimeline.map((stage, stageIdx) => (
              <StageItem
                key={stage.id || stageIdx}
                stage={stage}
                stageIdx={stageIdx}
                isExpanded={expandedStages.includes(stageIdx)}
                onToggle={toggleStage}
                onEdit={handleEditStage}
                onDelete={handleDeleteStage}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onSaveEditStage={handleSaveEditStage}
                onCancelEditStage={handleCancelEditStage}
                onSaveEditTask={handleSaveEditTask}
                onCancelEditTask={handleCancelEditTask}
                editingStageIdx={editingStageIdx}
                editingTask={editingTask}
                editStage={editStage}
                editTask={editTask}
                onEditStageChange={setEditStage}
                onEditTaskChange={setEditTask}
                addingTaskStageId={addingTaskStageId}
                newTask={newTask}
                onNewTaskChange={setNewTask}
                onSaveTask={handleSaveTask}
                onCancelTask={handleCancelTask}
                saving={saving}
                isMobile={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex lg:flex-[3]">
        <div className="flex flex-1 gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            <CostSummary budgetSummary={budgetSummary} />
            
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
                    <button 
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm" 
                      onClick={handleAddStage} 
                      disabled={addingStage || saving}
                    >
                      <FiPlus size={16} />
                      Add New Stage
                    </button>
                  </div>
                </div>
                
                {/* Task Table */}
                <TaskTable
                  taskTimeline={taskTimeline}
                  expandedStages={expandedStages}
                  addingStage={addingStage}
                  addingTaskStageId={addingTaskStageId}
                  editingStageIdx={editingStageIdx}
                  editingTask={editingTask}
                  newStage={newStage}
                  newTask={newTask}
                  editStage={editStage}
                  editTask={editTask}
                  onToggleStage={toggleStage}
                  onNewStageChange={setNewStage}
                  onNewTaskChange={setNewTask}
                  onEditStageChange={setEditStage}
                  onEditTaskChange={setEditTask}
                  onSaveStage={handleSaveStage}
                  onCancelStage={handleCancelStage}
                  onSaveTask={handleSaveTask}
                  onCancelTask={handleCancelTask}
                  onEditStage={handleEditStage}
                  onSaveEditStage={handleSaveEditStage}
                  onCancelEditStage={handleCancelEditStage}
                  onDeleteStage={handleDeleteStage}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onSaveEditTask={handleSaveEditTask}
                  onCancelEditTask={handleCancelEditTask}
                  onDeleteTask={handleDeleteTask}
                  saving={saving}
                />
              </div>            
            </div>
          </div>
        </div>
        
        {/* Right Sidebar - Project Team */}
        <ProjectTeam projectId={projectId}/>
      </div>
    </div>
  )
}

// Extracted components for better organization
const StageForm = ({ stage, onChange, onSave, onCancel, saving, isMobile = false }) => (
  <div className={`border ${isMobile ? 'border-primary-200 rounded-lg mb-3 p-2 bg-amber-50' : 'bg-amber-50'}`}>
    <input 
      type="text" 
      className="border rounded px-2 py-1 w-full mb-2" 
      placeholder="Stage Name" 
      value={stage.name} 
      onChange={e => onChange({ ...stage, name: e.target.value })} 
    />
    <div className="flex gap-2 mb-2">
      <input 
        type="date" 
        className="border rounded px-2 py-1 w-full" 
        value={stage.dueDate?.start || ""} 
        onChange={e => onChange({ ...stage, dueDate: { ...stage.dueDate, start: e.target.value } })} 
        placeholder="Start Date" 
      />
      <input 
        type="date" 
        className="border rounded px-2 py-1 w-full" 
        value={stage.dueDate?.end || ""} 
        onChange={e => onChange({ ...stage, dueDate: { ...stage.dueDate, end: e.target.value } })} 
        placeholder="End Date" 
      />
    </div>
    <input 
      type="number" 
      className="border rounded px-2 py-1 w-full mb-2" 
      placeholder="Cost" 
      value={stage.cost} 
      onChange={e => onChange({ ...stage, cost: e.target.value })} 
    />
    <select 
      className="border rounded px-2 py-1 w-full mb-2" 
      value={stage.status} 
      onChange={e => onChange({ ...stage, status: e.target.value })}
    >
      <option value="Pending">Pending</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
    </select>
    <div className="flex gap-2">
      <button className="text-green-600" onClick={onSave} disabled={saving}><FiCheck /></button>
      <button className="text-red-600" onClick={onCancel} disabled={saving}><FiX /></button>
    </div>
  </div>
)

const StageItem = ({
  stage,
  stageIdx,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onSaveEditStage,
  onCancelEditStage,
  onSaveEditTask,
  onCancelEditTask,
  editingStageIdx,
  editingTask,
  editStage,
  editTask,
  onEditStageChange,
  onEditTaskChange,
  addingTaskStageId,
  newTask,
  onNewTaskChange,
  onSaveTask,
  onCancelTask,
  saving,
  isMobile = false
}) => (
  <div className="border border-gray-200 rounded-lg mb-3">
    <div className="p-3">
      <div className="flex items-start gap-2 mb-2">
        <button onClick={() => onToggle(stageIdx)} className="mt-1">
          {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
        </button>
        <div className="flex-1">
          {editingStageIdx === stageIdx ? (
            <>
              <input 
                type="text" 
                className="border rounded px-2 py-1 w-full mb-1" 
                value={editStage.name} 
                onChange={e => onEditStageChange({ ...editStage, name: e.target.value })} 
              />
              <div className="flex gap-2 mb-1">
                <input 
                  type="date" 
                  className="border rounded px-2 py-1 w-full" 
                  value={editStage.dueDate?.start || ""} 
                  onChange={e => onEditStageChange({ ...editStage, dueDate: { ...editStage.dueDate, start: e.target.value } })} 
                  placeholder="Start Date" 
                />
                <input 
                  type="date" 
                  className="border rounded px-2 py-1 w-full" 
                  value={editStage.dueDate?.end || ""} 
                  onChange={e => onEditStageChange({ ...editStage, dueDate: { ...editStage.dueDate, end: e.target.value } })} 
                  placeholder="End Date" 
                />
              </div>
              <input 
                type="number" 
                className="border rounded px-2 py-1 w-full mb-1" 
                value={editStage.cost} 
                onChange={e => onEditStageChange({ ...editStage, cost: e.target.value })} 
              />
              <select 
                className="border rounded px-2 py-1 w-full mb-1" 
                value={editStage.status} 
                onChange={e => onEditStageChange({ ...editStage, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-2 mb-1">
                <button className="text-green-600" onClick={() => onSaveEditStage(stageIdx)} disabled={saving}><FiCheck /></button>
                <button className="text-red-600" onClick={onCancelEditStage} disabled={saving}><FiX /></button>
              </div>
            </>
          ) : (
            <>
              <div className="font-medium text-sm mb-1">{stage.name}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stage.status)}`}>
                  {stage.status}
                </span>
                <span className="text-xs text-gray-500">{renderDateRange(stage.dueDate)}</span>
                <span className="text-primary font-semibold text-sm">
                  ₦{parseCost(stage.cost).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 border border-gray-300 rounded" onClick={() => onEdit(stageIdx)}>
                  <FiEdit2 size={14} />
                </button>
                <button className="p-1.5 border border-gray-300 rounded" onClick={() => onDelete(stageIdx)}>
                  <FiTrash2 size={14} />
                </button>
                <button 
                  className="p-1.5 border border-gray-300 rounded" 
                  onClick={() => onAddTask(stageIdx)} 
                  disabled={addingTaskStageId !== null || saving}
                >
                  <FiPlus size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Subtasks */}
      {isExpanded && (
        <div className="ml-6 mt-3 space-y-3">
          {addingTaskStageId === stageIdx && (
            <TaskForm
              task={newTask}
              onChange={onNewTaskChange}
              onSave={() => onSaveTask(stageIdx)}
              onCancel={onCancelTask}
              saving={saving}
              isMobile={isMobile}
            />
          )}
          {(stage.tasks || []).map((task, taskIdx) => (
            <TaskItem
              key={task.id || taskIdx}
              task={task}
              stageIdx={stageIdx}
              taskIdx={taskIdx}
              editingTask={editingTask}
              editTask={editTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onSaveEditTask={onSaveEditTask}
              onCancelEditTask={onCancelEditTask}
              onEditTaskChange={onEditTaskChange}
              saving={saving}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)

const TaskForm = ({ task, onChange, onSave, onCancel, saving, isMobile = false }) => (
  <div className={`border-l-2 border-primary-200 pl-3 mb-2 bg-amber-50 p-2`}>
    <input 
      type="text" 
      className="border rounded px-2 py-1 w-full mb-1" 
      placeholder="Task Name" 
      value={task.name} 
      onChange={e => onChange({ ...task, name: e.target.value })} 
    />
    <div className="flex gap-2 mb-1">
      <input 
        type="date" 
        className="border rounded px-2 py-1 w-full" 
        value={task.dueDate?.start || ""} 
        onChange={e => onChange({ ...task, dueDate: { ...task.dueDate, start: e.target.value } })} 
        placeholder="Start Date" 
      />
      <input 
        type="date" 
        className="border rounded px-2 py-1 w-full" 
        value={task.dueDate?.end || ""} 
        onChange={e => onChange({ ...task, dueDate: { ...task.dueDate, end: e.target.value } })} 
        placeholder="End Date" 
      />
    </div>
    <input 
      type="number" 
      className="border rounded px-2 py-1 w-full mb-1" 
      placeholder="Cost" 
      value={task.cost} 
      onChange={e => onChange({ ...task, cost: e.target.value })} 
    />
    <select 
      className="border rounded px-2 py-1 w-full mb-1" 
      value={task.status} 
      onChange={e => onChange({ ...task, status: e.target.value })}
    >
      <option value="Pending">Pending</option>
      <option value="Ongoing">Ongoing</option>
      <option value="Completed">Completed</option>
    </select>
    <div className="flex gap-2">
      <button className="text-green-600" onClick={onSave} disabled={saving}><FiCheck /></button>
      <button className="text-red-600" onClick={onCancel} disabled={saving}><FiX /></button>
    </div>
  </div>
)

const TaskItem = ({
  task,
  stageIdx,
  taskIdx,
  editingTask,
  editTask,
  onEditTask,
  onDeleteTask,
  onSaveEditTask,
  onCancelEditTask,
  onEditTaskChange,
  saving,
  isMobile = false
}) => (
  <div className="border-l-2 border-gray-200 pl-3">
    {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
      <>
        <input 
          type="text" 
          className="border rounded px-2 py-1 w-full mb-1" 
          value={editTask.name} 
          onChange={e => onEditTaskChange({ ...editTask, name: e.target.value })} 
        />
        <div className="flex gap-2 mb-1">
          <input 
            type="date" 
            className="border rounded px-2 py-1 w-full" 
            value={editTask.dueDate?.start || ""} 
            onChange={e => onEditTaskChange({ ...editTask, dueDate: { ...editTask.dueDate, start: e.target.value } })} 
            placeholder="Start Date" 
          />
          <input 
            type="date" 
            className="border rounded px-2 py-1 w-full" 
            value={editTask.dueDate?.end || ""} 
            onChange={e => onEditTaskChange({ ...editTask, dueDate: { ...editTask.dueDate, end: e.target.value } })} 
            placeholder="End Date" 
          />
        </div>
        <input 
          type="number" 
          className="border rounded px-2 py-1 w-full mb-1" 
          value={editTask.cost} 
          onChange={e => onEditTaskChange({ ...editTask, cost: e.target.value })} 
        />
        <select 
          className="border rounded px-2 py-1 w-full mb-1" 
          value={editTask.status} 
          onChange={e => onEditTaskChange({ ...editTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
        <div className="flex gap-2 mb-1">
          <button className="text-green-600" onClick={() => onSaveEditTask(stageIdx, taskIdx)} disabled={saving}>
            <FiCheck />
          </button>
          <button className="text-red-600" onClick={onCancelEditTask} disabled={saving}>
            <FiX />
          </button>
        </div>
      </>
    ) : (
      <>
        <div className="font-medium text-sm mb-1">{task.name}</div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
          <span className="text-xs text-gray-500">{renderDateRange(task.dueDate)}</span>
          <span className="text-primary font-semibold text-sm">
            ₦{parseCost(task.cost).toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-1.5 border border-gray-300 rounded" onClick={() => onEditTask(stageIdx, taskIdx)}>
            <FiEdit2 size={14} />
          </button>
          <button className="p-1.5 border border-gray-300 rounded" onClick={() => onDeleteTask(stageIdx, taskIdx)}>
            <FiTrash2 size={14} />
          </button>
        </div>
      </>
    )}
  </div>
)

// TaskTable component for desktop view
const TaskTable = ({
  taskTimeline,
  expandedStages,
  addingStage,
  addingTaskStageId,
  editingStageIdx,
  editingTask,
  newStage,
  newTask,
  editStage,
  editTask,
  onToggleStage,
  onNewStageChange,
  onNewTaskChange,
  onEditStageChange,
  onEditTaskChange,
  onSaveStage,
  onCancelStage,
  onSaveTask,
  onCancelTask,
  onEditStage,
  onSaveEditStage,
  onCancelEditStage,
  onDeleteStage,
  onAddTask,
  onEditTask,
  onSaveEditTask,
  onCancelEditTask,
  onDeleteTask,
  saving
}) => (
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
          <tr className="bg-amber-50">
            <td className="py-2 px-2">
              <input 
                type="text" 
                className="border rounded px-2 py-1 w-full" 
                placeholder="Stage Name" 
                value={newStage.name} 
                onChange={e => onNewStageChange({ ...newStage, name: e.target.value })} 
              />
            </td>
            <td className="py-2 px-2">
              <select 
                className="border rounded px-2 py-1 w-full" 
                value={newStage.status} 
                onChange={e => onNewStageChange({ ...newStage, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td className="py-2 px-2">
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="border rounded px-2 py-1 w-full" 
                  value={newStage.dueDate?.start || ""} 
                  onChange={e => onNewStageChange({ ...newStage, dueDate: { ...newStage.dueDate, start: e.target.value } })} 
                  placeholder="Start Date" 
                />
                <input 
                  type="date" 
                  className="border rounded px-2 py-1 w-full" 
                  value={newStage.dueDate?.end || ""} 
                  onChange={e => onNewStageChange({ ...newStage, dueDate: { ...newStage.dueDate, end: e.target.value } })} 
                  placeholder="End Date" 
                />
              </div>
            </td>
            <td className="py-2 px-2">
              <input 
                type="number" 
                className="border rounded px-2 py-1 w-full" 
                placeholder="Cost" 
                value={newStage.cost} 
                onChange={e => onNewStageChange({ ...newStage, cost: e.target.value })} 
              />
            </td>
            <td className="py-2 px-2 flex gap-2">
              <button className="text-green-600" onClick={onSaveStage} disabled={saving}><FiCheck /></button>
              <button className="text-red-600" onClick={onCancelStage} disabled={saving}><FiX /></button>
            </td>
          </tr>
        )}
        
        {/* Stages and Tasks */}
        {taskTimeline.map((stage, stageIdx) => (
          <StageTableRow
            key={stage.id || stageIdx}
            stage={stage}
            stageIdx={stageIdx}
            isExpanded={expandedStages.includes(stageIdx)}
            editingStageIdx={editingStageIdx}
            editStage={editStage}
            addingTaskStageId={addingTaskStageId}
            editingTask={editingTask}
            editTask={editTask}
            newTask={newTask}
            onToggleStage={onToggleStage}
            onEditStage={onEditStage}
            onSaveEditStage={onSaveEditStage}
            onCancelEditStage={onCancelEditStage}
            onDeleteStage={onDeleteStage}
            onAddTask={onAddTask}
            onEditStageChange={onEditStageChange}
            onNewTaskChange={onNewTaskChange}
            onSaveTask={onSaveTask}
            onCancelTask={onCancelTask}
            onEditTask={onEditTask}
            onSaveEditTask={onSaveEditTask}
            onCancelEditTask={onCancelEditTask}
            onDeleteTask={onDeleteTask}
            onEditTaskChange={onEditTaskChange}
            saving={saving}
          />
        ))}
      </tbody>
    </table>
  </div>
)

const StageTableRow = ({
  stage,
  stageIdx,
  isExpanded,
  editingStageIdx,
  editStage,
  addingTaskStageId,
  editingTask,
  editTask,
  newTask,
  onToggleStage,
  onEditStage,
  onSaveEditStage,
  onCancelEditStage,
  onDeleteStage,
  onAddTask,
  onEditStageChange,
  onNewTaskChange,
  onSaveTask,
  onCancelTask,
  onEditTask,
  onSaveEditTask,
  onCancelEditTask,
  onDeleteTask,
  onEditTaskChange,
  saving
}) => (
  <>
    <tr className="border-b border-gray-100">
      <td className="py-3 px-2">
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleStage(stageIdx)}>
            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </button>
          {editingStageIdx === stageIdx ? (
            <input 
              type="text" 
              className="border rounded px-2 py-1 w-full" 
              value={editStage.name} 
              onChange={e => onEditStageChange({ ...editStage, name: e.target.value })} 
            />
          ) : (
            <span className="text-sm font-medium">{stage.name}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-2">
        {editingStageIdx === stageIdx ? (
          <select 
            className="border rounded px-2 py-1 w-full" 
            value={editStage.status} 
            onChange={e => onEditStageChange({ ...editStage, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stage.status)}`}>
            {stage.status}
          </span>
        )}
      </td>
      <td className="py-3 px-2 text-sm text-gray-600">
        {editingStageIdx === stageIdx ? (
          <div className="flex gap-2">
            <input 
              type="date" 
              className="border rounded px-2 py-1 w-full" 
              value={editStage.dueDate?.start || ""} 
              onChange={e => onEditStageChange({ ...editStage, dueDate: { ...editStage.dueDate, start: e.target.value } })} 
              placeholder="Start Date" 
            />
            <input 
              type="date" 
              className="border rounded px-2 py-1 w-full" 
              value={editStage.dueDate?.end || ""} 
              onChange={e => onEditStageChange({ ...editStage, dueDate: { ...editStage.dueDate, end: e.target.value } })} 
              placeholder="End Date" 
            />
          </div>
        ) : (
          renderDateRange(stage.dueDate)
        )}
      </td>
      <td className="py-3 px-2 text-sm font-semibold text-primary">
        {editingStageIdx === stageIdx ? (
          <input 
            type="number" 
            className="border rounded px-2 py-1 w-full" 
            value={editStage.cost} 
            onChange={e => onEditStageChange({ ...editStage, cost: e.target.value })} 
          />
        ) : (
          <>₦{parseCost(stage.cost).toLocaleString()}</>
        )}
      </td>
      <td className="py-3 px-2 flex gap-2">
        {editingStageIdx === stageIdx ? (
          <>
            <button className="text-green-600" onClick={() => onSaveEditStage(stageIdx)} disabled={saving}>
              <FiCheck />
            </button>
            <button className="text-red-600" onClick={onCancelEditStage} disabled={saving}>
              <FiX />
            </button>
          </>
        ) : (
          <>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onEditStage(stageIdx)}>
              <FiEdit2 size={16} className="text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onDeleteStage(stageIdx)}>
              <FiTrash2 size={16} className="text-gray-600" />
            </button>
            <button 
              className="flex items-center gap-1 text-xs text-primary-600" 
              onClick={() => onAddTask(stageIdx)} 
              disabled={addingTaskStageId !== null || saving}
            >
              <FiPlus /> Add Task
            </button>
          </>
        )}
      </td>
    </tr>
    
    {/* Add Task Row */}
    {addingTaskStageId === stageIdx && (
      <tr className="bg-amber-50">
        <td className="py-2 px-2 pl-10">
          <input 
            type="text" 
            className="border rounded px-2 py-1 w-full" 
            placeholder="Task Name" 
            value={newTask.name} 
            onChange={e => onNewTaskChange({ ...newTask, name: e.target.value })} 
          />
        </td>
        <td className="py-2 px-2">
          <select 
            className="border rounded px-2 py-1 w-full" 
            value={newTask.status} 
            onChange={e => onNewTaskChange({ ...newTask, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </td>
        <td className="py-2 px-2">
          <div className="flex gap-2">
            <input 
              type="date" 
              className="border rounded px-2 py-1 w-full" 
              value={newTask.dueDate?.start || ""} 
              onChange={e => onNewTaskChange({ ...newTask, dueDate: { ...newTask.dueDate, start: e.target.value } })} 
              placeholder="Start Date" 
            />
            <input 
              type="date" 
              className="border rounded px-2 py-1 w-full" 
              value={newTask.dueDate?.end || ""} 
              onChange={e => onNewTaskChange({ ...newTask, dueDate: { ...newTask.dueDate, end: e.target.value } })} 
              placeholder="End Date" 
            />
          </div>
        </td>
        <td className="py-2 px-2">
          <input 
            type="number" 
            className="border rounded px-2 py-1 w-full" 
            placeholder="Cost" 
            value={newTask.cost} 
            onChange={e => onNewTaskChange({ ...newTask, cost: e.target.value })} 
          />
        </td>
        <td className="py-2 px-2 flex gap-2">
          <button className="text-green-600" onClick={() => onSaveTask(stageIdx)} disabled={saving}>
            <FiCheck />
          </button>
          <button className="text-red-600" onClick={onCancelTask} disabled={saving}>
            <FiX />
          </button>
        </td>
      </tr>
    )}
    
    {/* Tasks */}
    {isExpanded && (stage.tasks || []).map((task, taskIdx) => (
      <TaskTableRow
        key={task.id || taskIdx}
        task={task}
        stageIdx={stageIdx}
        taskIdx={taskIdx}
        editingTask={editingTask}
        editTask={editTask}
        onEditTask={onEditTask}
        onSaveEditTask={onSaveEditTask}
        onCancelEditTask={onCancelEditTask}
        onDeleteTask={onDeleteTask}
        onEditTaskChange={onEditTaskChange}
        saving={saving}
      />
    ))}
  </>
)

const TaskTableRow = ({
  task,
  stageIdx,
  taskIdx,
  editingTask,
  editTask,
  onEditTask,
  onSaveEditTask,
  onCancelEditTask,
  onDeleteTask,
  onEditTaskChange,
  saving
}) => (
  <tr className="border-b border-gray-100 bg-gray-50">
    <td className="py-3 px-2 pl-10">
      {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
        <input 
          type="text" 
          className="border rounded px-2 py-1 w-full" 
          value={editTask.name} 
          onChange={e => onEditTaskChange({ ...editTask, name: e.target.value })} 
        />
      ) : (
        <span className="text-sm text-gray-700">{task.name}</span>
      )}
    </td>
    <td className="py-3 px-2">
      {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
        <select 
          className="border rounded px-2 py-1 w-full" 
          value={editTask.status} 
          onChange={e => onEditTaskChange({ ...editTask, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      ) : (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      )}
    </td>
    <td className="py-3 px-2 text-sm text-gray-600">
      {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
        <div className="flex gap-2">
          <input 
            type="date" 
            className="border rounded px-2 py-1 w-full" 
            value={editTask.dueDate?.start || ""} 
            onChange={e => onEditTaskChange({ ...editTask, dueDate: { ...editTask.dueDate, start: e.target.value } })} 
            placeholder="Start Date" 
          />
          <input 
            type="date" 
            className="border rounded px-2 py-1 w-full" 
            value={editTask.dueDate?.end || ""} 
            onChange={e => onEditTaskChange({ ...editTask, dueDate: { ...editTask.dueDate, end: e.target.value } })} 
            placeholder="End Date" 
          />
        </div>
      ) : (
        renderDateRange(task.dueDate)
      )}
    </td>
    <td className="py-3 px-2 text-sm font-semibold text-primary">
      {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
        <input 
          type="number" 
          className="border rounded px-2 py-1 w-full" 
          value={editTask.cost} 
          onChange={e => onEditTaskChange({ ...editTask, cost: e.target.value })} 
        />
      ) : (
        <>₦{parseCost(task.cost).toLocaleString()}</>
      )}
    </td>
    <td className="py-3 px-2 flex gap-2">
      {editingTask.stageIdx === stageIdx && editingTask.taskIdx === taskIdx ? (
        <>
          <button className="text-green-600" onClick={() => onSaveEditTask(stageIdx, taskIdx)} disabled={saving}>
            <FiCheck />
          </button>
          <button className="text-red-600" onClick={onCancelEditTask} disabled={saving}>
            <FiX />
          </button>
        </>
      ) : (
        <>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onEditTask(stageIdx, taskIdx)}>
            <FiEdit2 size={16} className="text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded" onClick={() => onDeleteTask(stageIdx, taskIdx)}>
            <FiTrash2 size={16} className="text-gray-600" />
          </button>
        </>
      )}
    </td>
  </tr>
)