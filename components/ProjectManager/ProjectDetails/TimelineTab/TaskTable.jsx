"use client"

import { FiCheck, FiX, FiEdit2, FiTrash2, FiPlus, FiChevronRight, FiChevronDown } from "react-icons/fi"
import { getStatusColor, renderDateRange, parseCost } from "@/utils/calculations"

export default function TaskTable({
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
}) {
  return (
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
}

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