"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { parseCost } from "../utils/calculations"

// Import ALL possible notification functions
import { 
  // Old pattern functions (if they exist)
  notifyPhaseCompletion, 
  notifyTaskCompletion, 
  notifyTaskCreation,
  // New pattern functions (if they exist)
  notifyStageCreated, 
  notifyStageUpdated, 
  notifyStageDeleted,
  notifyTaskCreated,
  notifyTaskUpdated,
  notifyTaskDeleted 
} from "@/utils/notifications"

const DEFAULT_STAGE = {
  name: "",
  dueDate: { start: "", end: "" },
  cost: "",
  status: "Pending",
  tasks: []
}

const DEFAULT_TASK = {
  name: "",
  dueDate: { start: "", end: "" },
  cost: "",
  status: "Pending"
}

// Helper function to check if a notification function exists
const safeNotify = async (func, params) => {
  if (typeof func === 'function') {
    try {
      await func(params)
      console.log(`✅ Notification sent: ${func.name}`)
    } catch (error) {
      console.error(`❌ Notification failed: ${func.name}`, error)
      // Don't throw - notifications are secondary
    }
  } else {
    console.warn(`⚠️ Notification function not available: ${func}`)
  }
}

// Compatibility wrapper functions
const notifyStageCreatedCompat = async (params) => {
  // Try new pattern first, fall back to old if needed
  if (typeof notifyStageCreated === 'function') {
    await safeNotify(notifyStageCreated, params)
  }
  // You could add fallback to old pattern here if needed
}

const notifyStageUpdatedCompat = async (params) => {
  if (typeof notifyStageUpdated === 'function') {
    await safeNotify(notifyStageUpdated, params)
  }
}

const notifyStageDeletedCompat = async (params) => {
  if (typeof notifyStageDeleted === 'function') {
    await safeNotify(notifyStageDeleted, params)
  }
}

const notifyTaskCreatedCompat = async (params) => {
  // Try both patterns for maximum compatibility
  if (typeof notifyTaskCreated === 'function') {
    // New pattern
    await safeNotify(notifyTaskCreated, {
      projectId: params.projectId,
      taskName: params.taskName,
      stageName: params.stageName,
      dueDate: params.dueDate || { start: params.startDate, end: params.endDate },
      cost: params.cost || params.taskCost,
      createdById: params.createdById,
      createdByName: params.createdByName
    })
  } else if (typeof notifyTaskCreation === 'function') {
    // Old pattern fallback
    await safeNotify(notifyTaskCreation, {
      projectId: params.projectId,
      taskName: params.taskName,
      stageName: params.stageName,
      taskCost: params.cost || params.taskCost,
      startDate: params.startDate || (params.dueDate?.start || ''),
      endDate: params.endDate || (params.dueDate?.end || ''),
      createdById: params.createdById,
      createdByName: params.createdByName
    })
  }
}

const notifyTaskUpdatedCompat = async (params) => {
  if (typeof notifyTaskUpdated === 'function') {
    await safeNotify(notifyTaskUpdated, params)
  }
}

const notifyTaskDeletedCompat = async (params) => {
  if (typeof notifyTaskDeleted === 'function') {
    await safeNotify(notifyTaskDeleted, params)
  }
}

const notifyTaskCompletionCompat = async (params) => {
  // Try old pattern first (since it's in the original code)
  if (typeof notifyTaskCompletion === 'function') {
    await safeNotify(notifyTaskCompletion, params)
  }
}

const notifyPhaseCompletionCompat = async (params) => {
  // Try old pattern first
  if (typeof notifyPhaseCompletion === 'function') {
    await safeNotify(notifyPhaseCompletion, params)
  }
}

export function useTimelineOperations(projectId, taskTimeline, setTaskTimeline, setError, currentUser) {
  // Use consistent state initialization (compatible with both patterns)
  const [addingStage, setAddingStage] = useState(false)
  const [addingTaskStageId, setAddingTaskStageId] = useState(null)
  const [newStage, setNewStage] = useState(DEFAULT_STAGE)
  const [newTask, setNewTask] = useState(DEFAULT_TASK)
  const [saving, setSaving] = useState(false)
  const [editingStageIdx, setEditingStageIdx] = useState(null)
  const [editingTask, setEditingTask] = useState({ stageIdx: null, taskIdx: null })
  const [editStage, setEditStage] = useState(DEFAULT_STAGE) // Use DEFAULT instead of {} or null
  const [editTask, setEditTask] = useState(DEFAULT_TASK) // Use DEFAULT instead of {} or null

  // Helper to get user info safely
  const getUserInfo = () => ({
    uid: currentUser?.uid,
    name: currentUser?.displayName || currentUser?.name || currentUser?.email || 'Project Manager'
  })

  // Stage Operations
  const handleAddStage = () => {
    setAddingStage(true)
    setNewStage(DEFAULT_STAGE)
  }

  const handleSaveStage = async () => {
    if (!newStage.name.trim() || !newStage.dueDate.start || !newStage.dueDate.end || !newStage.cost) {
      setError("Please fill all required fields")
      return
    }
    
    setSaving(true)
    setError(null)
    try {
      const stageToAdd = { 
        ...newStage, 
        id: Date.now().toString(), 
        tasks: [] 
      }
      const updatedTimeline = [...taskTimeline, stageToAdd]
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      setAddingStage(false)
      
      // NOTIFICATION: Stage created (compatible with both patterns)
      const userInfo = getUserInfo()
      await notifyStageCreatedCompat({
        projectId,
        stageName: stageToAdd.name,
        dueDate: stageToAdd.dueDate,
        cost: stageToAdd.cost,
        createdById: userInfo.uid,
        createdByName: userInfo.name
      })
      
      setNewStage(DEFAULT_STAGE)
    } catch (err) {
      console.error('Error saving stage:', err)
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
    setError(null)
    try {
      const stageToDelete = taskTimeline[stageIdx]
      const updatedTimeline = taskTimeline.filter((_, idx) => idx !== stageIdx)
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      
      // NOTIFICATION: Stage deleted
      const userInfo = getUserInfo()
      await notifyStageDeletedCompat({
        projectId,
        stageName: stageToDelete.name,
        deletedById: userInfo.uid,
        deletedByName: userInfo.name
      })
      
    } catch (err) {
      console.error('Error deleting stage:', err)
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
    // Validation (maintains backward compatibility with budget checks)
    if (!editStage.name?.trim() || !editStage.dueDate?.start || !editStage.dueDate?.end || !editStage.cost) {
      setError("Please fill all required fields")
      return
    }
    
    const stage = taskTimeline[stageIdx]
    const newStageCost = parseCost(editStage.cost)
    const tasksTotal = (stage.tasks || []).reduce((sum, t) => sum + parseCost(t.cost), 0)
    
    if (newStageCost < tasksTotal) {
      setError(`Cannot save stage. Stage cost (₦${newStageCost.toLocaleString()}) must be greater than or equal to tasks total (₦${tasksTotal.toLocaleString()})`)
      return
    }
    
    setSaving(true)
    setError(null)
    try {
      const updatedTimeline = [...taskTimeline]
      const oldStage = taskTimeline[stageIdx]
      
      updatedTimeline[stageIdx] = { ...editStage }
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      
      // Detect changes for notification
      const changes = []
      if (oldStage.name !== editStage.name) changes.push(`Name changed to "${editStage.name}"`)
      if (oldStage.status !== editStage.status) changes.push(`Status changed to ${editStage.status}`)
      if (oldStage.cost !== editStage.cost) changes.push(`Cost updated`)
      if (JSON.stringify(oldStage.dueDate) !== JSON.stringify(editStage.dueDate)) {
        changes.push(`Due date updated`)
      }
      
      // NOTIFICATION: Stage updated
      const userInfo = getUserInfo()
      await notifyStageUpdatedCompat({
        projectId,
        stageName: editStage.name,
        changes: changes.length > 0 ? changes : ['Stage details updated'],
        updatedById: userInfo.uid,
        updatedByName: userInfo.name
      })
      
      // NOTIFICATION: Check if stage status changed to completed (backward compatible)
      if (oldStage.status !== 'completed' && editStage.status === 'completed') {
        await notifyPhaseCompletionCompat({
          projectId,
          phaseName: editStage.name || oldStage.name,
          completedById: userInfo.uid,
          completedByName: userInfo.name
        })
      }
      
      setEditingStageIdx(null)
      setEditStage(DEFAULT_STAGE)
    } catch (err) {
      console.error('Error updating stage:', err)
      setError("Failed to update stage")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEditStage = () => {
    setEditingStageIdx(null)
    setEditStage(DEFAULT_STAGE)
  }

  // Task Operations
  const handleAddTask = (stageIdx) => {
    setAddingTaskStageId(stageIdx)
    setNewTask(DEFAULT_TASK)
  }

  const handleSaveTask = async (stageIdx) => {
    if (!newTask.name.trim() || !newTask.dueDate.start || !newTask.dueDate.end || !newTask.cost) {
      setError("Please fill all required fields")
      return
    }
    
    const stage = taskTimeline[stageIdx]
    const stageCost = parseCost(stage.cost)
    const existingTasksTotal = (stage.tasks || []).reduce((sum, t) => sum + parseCost(t.cost), 0)
    const newTaskCost = parseCost(newTask.cost)
    const totalTasksCost = existingTasksTotal + newTaskCost
    
    if (totalTasksCost > stageCost) {
      const available = stageCost - existingTasksTotal
      setError(`Cannot add task. Stage budget: ₦${stageCost.toLocaleString()}, Tasks total would be: ₦${totalTasksCost.toLocaleString()}. Available budget: ₦${available.toLocaleString()}`)
      return
    }
    
    setSaving(true)
    setError(null)
    try {
      const updatedTimeline = [...taskTimeline]
      const updatedStage = { ...updatedTimeline[stageIdx] }
      const taskToAdd = { ...newTask, id: Date.now().toString() }
      
      updatedStage.tasks = [...(updatedStage.tasks || []), taskToAdd]
      updatedTimeline[stageIdx] = updatedStage
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      
      // NOTIFICATION: Send task creation notification (backward compatible)
      const userInfo = getUserInfo()
      await notifyTaskCreatedCompat({
        projectId,
        taskName: taskToAdd.name,
        stageName: updatedStage.name,
        dueDate: taskToAdd.dueDate,
        cost: taskToAdd.cost,
        taskCost: taskToAdd.cost, // For old pattern compatibility
        startDate: taskToAdd.dueDate.start,
        endDate: taskToAdd.dueDate.end,
        createdById: userInfo.uid,
        createdByName: userInfo.name
      })
      
      setAddingTaskStageId(null)
      setNewTask(DEFAULT_TASK)
    } catch (err) {
      console.error('Error saving task:', err)
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
    setError(null)
    try {
      const updatedTimeline = [...taskTimeline]
      const stage = updatedTimeline[stageIdx]
      const taskToDelete = stage.tasks[taskIdx]
      
      updatedTimeline[stageIdx].tasks = updatedTimeline[stageIdx].tasks.filter((_, idx) => idx !== taskIdx)
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      
      // NOTIFICATION: Task deleted
      const userInfo = getUserInfo()
      await notifyTaskDeletedCompat({
        projectId,
        taskName: taskToDelete.name,
        stageName: stage.name,
        deletedById: userInfo.uid,
        deletedByName: userInfo.name
      })
      
    } catch (err) {
      console.error('Error deleting task:', err)
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
    if (!editTask.name?.trim() || !editTask.dueDate?.start || !editTask.dueDate?.end || !editTask.cost) {
      setError("Please fill all required fields")
      return
    }
    
    const stage = taskTimeline[stageIdx]
    const stageCost = parseCost(stage.cost)
    const otherTasksTotal = (stage.tasks || []).reduce((sum, t, idx) => {
      if (idx === taskIdx) return sum
      return sum + parseCost(t.cost)
    }, 0)
    const editedTaskCost = parseCost(editTask.cost)
    const totalTasksCost = otherTasksTotal + editedTaskCost
    
    if (totalTasksCost > stageCost) {
      const available = stageCost - otherTasksTotal
      setError(`Cannot save task. Stage budget: ₦${stageCost.toLocaleString()}, Tasks total would be: ₦${totalTasksCost.toLocaleString()}. Available budget: ₦${available.toLocaleString()}`)
      return
    }
    
    setSaving(true)
    setError(null)
    try {
      const updatedTimeline = [...taskTimeline]
      const oldTask = taskTimeline[stageIdx].tasks[taskIdx]
      const stage = updatedTimeline[stageIdx]
      
      stage.tasks[taskIdx] = { ...editTask }
      
      await updateDoc(doc(db, "projects", projectId), { 
        taskTimeline: updatedTimeline 
      })
      
      setTaskTimeline(updatedTimeline)
      
      // Detect changes for notification
      const changes = []
      if (oldTask.name !== editTask.name) changes.push(`Name changed to "${editTask.name}"`)
      if (oldTask.status !== editTask.status) changes.push(`Status changed to ${editTask.status}`)
      if (oldTask.cost !== editTask.cost) changes.push(`Cost updated`)
      if (JSON.stringify(oldTask.dueDate) !== JSON.stringify(editTask.dueDate)) {
        changes.push(`Due date updated`)
      }
      
      // NOTIFICATION: Task updated
      const userInfo = getUserInfo()
      await notifyTaskUpdatedCompat({
        projectId,
        taskName: editTask.name,
        stageName: stage.name,
        changes: changes.length > 0 ? changes : ['Task details updated'],
        updatedById: userInfo.uid,
        updatedByName: userInfo.name
      })
      
      // NOTIFICATION: Check if task status changed to completed (backward compatible)
      if (oldTask.status !== 'completed' && editTask.status === 'completed') {
        await notifyTaskCompletionCompat({
          projectId,
          taskName: editTask.name || oldTask.name,
          stageName: stage.name,
          completedById: userInfo.uid,
          completedByName: userInfo.name
        })
      }
      
      setEditingTask({ stageIdx: null, taskIdx: null })
      setEditTask(DEFAULT_TASK)
    } catch (err) {
      console.error('Error updating task:', err)
      setError("Failed to update task")
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEditTask = () => {
    setEditingTask({ stageIdx: null, taskIdx: null })
    setEditTask(DEFAULT_TASK)
  }

  return {
    addingStage,
    addingTaskStageId,
    newStage,
    newTask,
    saving,
    editingStageIdx,
    editingTask,
    editStage,
    editTask,
    handleAddStage,
    handleSaveStage,
    handleCancelStage,
    handleDeleteStage,
    handleEditStage,
    handleSaveEditStage,
    handleCancelEditStage,
    handleAddTask,
    handleSaveTask,
    handleCancelTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEditTask,
    handleCancelEditTask,
    setNewStage,
    setNewTask,
    setEditStage,
    setEditTask
  }
}