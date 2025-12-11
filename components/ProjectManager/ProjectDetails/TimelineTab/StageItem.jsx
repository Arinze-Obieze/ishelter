"use client"

import { FiChevronRight, FiChevronDown, FiEdit2, FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi"
import { getStatusColor, renderDateRange, parseCost } from "@/utils/calculations"
import TaskForm from "./TaskForm"
import TaskItem from "./TaskItem"

export default function StageItem({
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
}) {
  return (
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
                    onClick={() => {
                      onAddTask(stageIdx)
                      // Auto-expand stage on mobile when adding task
                      if (isMobile && !isExpanded) {
                        onToggle(stageIdx)
                      }
                    }} 
                    disabled={addingTaskStageId !== null || saving}
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
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
}

