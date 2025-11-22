"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import TabsNavigation from "../TabsNavigation"
import ProjectTeam from "@/components/ProjectManager/ProjectDetails/ProjectTeam"
import CostSummary from "./CostSummary"
import TaskTable from "./TaskTable"
import MobileTimelineView from "./MobileTimelineView"
import { useTimelineData } from "@/hooks/useTimelineData"
import { useTimelineOperations } from "@/hooks/useTimelineOperations"
import { calculateBudgetSummary } from "@/utils/calculations"
import { FiPlus } from "react-icons/fi"

export default function TimelineTab({ projectId, tabs, activeTab, onTabChange }) {
  const [activeMobileTab, setActiveMobileTab] = useState("tasks")
  
  const {
    taskTimeline,
    expandedStages,
    loading,
    error,
    setTaskTimeline,
    setExpandedStages,
    setError
  } = useTimelineData(projectId)

  const {
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
  } = useTimelineOperations(projectId, taskTimeline, setTaskTimeline, setError)

  const budgetSummary = calculateBudgetSummary(taskTimeline)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        <div className="bg-white border-b border-gray-200 flex">
          <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        </div>
        
        <MobileTimelineView
          error={error}
          budgetSummary={budgetSummary}
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
          saving={saving}
          onAddStage={handleAddStage}
          onToggleStage={(stageIdx) => setExpandedStages(prev => 
            prev.includes(stageIdx) 
              ? prev.filter(i => i !== stageIdx) 
              : [...prev, stageIdx]
          )}
          onNewStageChange={setNewStage}
          onNewTaskChange={setNewTask}
          onEditStageChange={setEditStage}
          onEditTaskChange={setEditTask}
          onSaveStage={handleSaveStage}
          onCancelStage={handleCancelStage}
          onEditStage={handleEditStage}
          onSaveEditStage={handleSaveEditStage}
          onCancelEditStage={handleCancelEditStage}
          onDeleteStage={handleDeleteStage}
          onAddTask={handleAddTask}
          onSaveTask={handleSaveTask}
          onCancelTask={handleCancelTask}
          onEditTask={handleEditTask}
          onSaveEditTask={handleSaveEditTask}
          onCancelEditTask={handleCancelEditTask}
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex lg:flex-[3]">
        <div className="flex flex-1 gap-6">
          <div className="flex-1">
            <CostSummary budgetSummary={budgetSummary} />
            
            <div className="mb-6 mt-8">
              <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
            </div>
            
            <div className="flex flex-col gap-6 mx-6 mt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
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
                  onToggleStage={(stageIdx) => setExpandedStages(prev => 
                    prev.includes(stageIdx) 
                      ? prev.filter(i => i !== stageIdx) 
                      : [...prev, stageIdx]
                  )}
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
        
        <ProjectTeam projectId={projectId}/>
      </div>
    </div>
  )
}