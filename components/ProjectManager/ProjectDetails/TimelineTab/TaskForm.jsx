"use client"

import { FiCheck, FiX } from "react-icons/fi"

export default function TaskForm({ task, onChange, onSave, onCancel, saving, isMobile = false }) {
  return (
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
}