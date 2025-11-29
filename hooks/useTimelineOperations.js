"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { parseCost } from "../utils/calculations"
import { notifyPhaseCompletion, notifyTaskCompletion } from "@/utils/notifications"

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

export function useTimelineOperations(projectId, taskTimeline, setTaskTimeline, setError, currentUser) {
  const [addingStage, setAddingStage] = useState(false)
  const [addingTaskStageId, setAddingTaskStageId] = useState(null)
  const [newStage, setNewStage] = useState(DEFAULT_STAGE)
  const [newTask, setNewTask] = useState(DEFAULT_TASK)
  const [saving, setSaving] = useState(false)
  const [editingStageIdx, setEditingStageIdx] = useState(null)
  const [editingTask, setEditingTask] = useState({ stageIdx: null, taskIdx: null })
  const [editStage, setEditStage] = useState({})
  const [editTask, setEditTask] = useState({})

  const handleAddStage = () => {
    setAddingStage(true)
    setNewStage(DEFAULT_STAGE)
  }

  const handleSaveStage = async () => {
    if (!newStage.name || !newStage.dueDate.start || !newStage.dueDate.end || !newStage.cost) {
      setError("Please fill all required fields")
      return
    }
    
    setSaving(true)
    setError(null)
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
    setError(null)
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
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      
      // NOTIFICATION: Check if stage status changed to completed
      if (oldStage.status !== 'completed' && editStage.status === 'completed') {
        try {
          await notifyPhaseCompletion({
            projectId: projectId,
            phaseName: editStage.name || oldStage.name,
            completedById: currentUser?.uid,
            completedByName: currentUser?.displayName || currentUser?.name || currentUser?.email || 'Unknown User'
          })
          console.log('✅ Phase completion notification sent successfully')
        } catch (notificationError) {
          console.error('❌ Failed to send phase completion notification:', notificationError)
          // Don't throw - stage was updated successfully, notification is secondary
        }
      }
      
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

  const handleAddTask = (stageIdx) => {
    setAddingTaskStageId(stageIdx)
    setNewTask(DEFAULT_TASK)
  }

  const handleSaveTask = async (stageIdx) => {
    if (!newTask.name || !newTask.dueDate.start || !newTask.dueDate.end || !newTask.cost) {
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
      updatedStage.tasks = [...(updatedStage.tasks || []), { ...newTask, id: Date.now().toString() }]
      updatedTimeline[stageIdx] = updatedStage
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
    setError(null)
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
      updatedTimeline[stageIdx].tasks[taskIdx] = { ...editTask }
      await updateDoc(doc(db, "projects", projectId), { taskTimeline: updatedTimeline })
      setTaskTimeline(updatedTimeline)
      
      // NOTIFICATION: Check if task status changed to completed
      if (oldTask.status !== 'completed' && editTask.status === 'completed') {
        try {
          await notifyTaskCompletion({
            projectId: projectId,
            taskName: editTask.name || oldTask.name,
            stageName: stage.name,
            completedById: currentUser?.uid,
            completedByName: currentUser?.displayName || currentUser?.name || currentUser?.email || 'Unknown User'
          })
          console.log('✅ Task completion notification sent successfully')
        } catch (notificationError) {
          console.error('❌ Failed to send task completion notification:', notificationError)
          // Don't throw - task was updated successfully, notification is secondary
        }
      }
      
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