"use client"

import { FiCheck, FiX } from "react-icons/fi"

export default function StageForm({ stage, onChange, onSave, onCancel, saving, isMobile = false }) {
  return (
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
}