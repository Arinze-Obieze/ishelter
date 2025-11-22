"use client"

import { FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi"
import { getStatusColor, renderDateRange, parseCost } from "@/utils/calculations"

export default function TaskItem({
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
}) {
  return (
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
}