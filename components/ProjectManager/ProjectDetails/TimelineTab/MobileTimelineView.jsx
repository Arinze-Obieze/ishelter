"use client"

import { FiPlus } from "react-icons/fi"
import CostSummary from "./CostSummary"
import StageForm from "./StageForm"
import StageItem from "./StageItem"

export default function MobileTimelineView({
  error,
  budgetSummary,
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
  saving,
  onAddStage,
  onToggleStage,
  onNewStageChange,
  onNewTaskChange,
  onEditStageChange,
  onEditTaskChange,
  onSaveStage,
  onCancelStage,
  onEditStage,
  onSaveEditStage,
  onCancelEditStage,
  onDeleteStage,
  onAddTask,
  onSaveTask,
  onCancelTask,
  onEditTask,
  onSaveEditTask,
  onCancelEditTask,
  onDeleteTask
}) {
  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <CostSummary budgetSummary={budgetSummary} isMobile={true} />
      
      <div className="bg-white rounded-lg p-4 mb-4">
        <h3 className="text-base font-bold mb-3">Project Timeline & Cost Management</h3>
        <div className="flex gap-2 mb-4">
          <button 
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded text-sm" 
            onClick={onAddStage} 
            disabled={addingStage || saving}
          >
            <FiPlus size={14} />
            Add Stage
          </button>
        </div>
        
        <h4 className="text-sm font-semibold mb-3">Task Management</h4>
        
        {addingStage && (
          <StageForm
            stage={newStage}
            onChange={onNewStageChange}
            onSave={onSaveStage}
            onCancel={onCancelStage}
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
            onToggle={onToggleStage}
            onEdit={onEditStage}
            onDelete={onDeleteStage}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onSaveEditStage={onSaveEditStage}
            onCancelEditStage={onCancelEditStage}
            onSaveEditTask={onSaveEditTask}
            onCancelEditTask={onCancelEditTask}
            editingStageIdx={editingStageIdx}
            editingTask={editingTask}
            editStage={editStage}
            editTask={editTask}
            onEditStageChange={onEditStageChange}
            onEditTaskChange={onEditTaskChange}
            addingTaskStageId={addingTaskStageId}
            newTask={newTask}
            onNewTaskChange={onNewTaskChange}
            onSaveTask={onSaveTask}
            onCancelTask={onCancelTask}
            saving={saving}
            isMobile={true}
          />
        ))}
      </div>
    </div>
  )
}