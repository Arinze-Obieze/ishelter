import React, { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const DEFAULT_MEMBER = { name: '', role: '' }

const ProjectTeam = ({ projectId }) => {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [newMember, setNewMember] = useState(DEFAULT_MEMBER)
  const [editMember, setEditMember] = useState(DEFAULT_MEMBER)
  const [saving, setSaving] = useState(false)

  // Fetch project team from Firestore
  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    const fetchTeam = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId)
        const projectSnap = await getDoc(projectRef)
        if (projectSnap.exists()) {
          const data = projectSnap.data()
          setTeam(Array.isArray(data.projectTeam) ? data.projectTeam : [])
        } else {
          setTeam([])
        }
      } catch (err) {
        setError('Failed to fetch project team')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [projectId])

  // Add member
  const handleAdd = () => {
    setAdding(true)
    setNewMember(DEFAULT_MEMBER)
  }
  const handleSaveAdd = async () => {
    if (!newMember.name || !newMember.role) return
    setSaving(true)
    try {
      const updatedTeam = [...team, { ...newMember }]
      await updateDoc(doc(db, 'projects', projectId), { projectTeam: updatedTeam })
      setTeam(updatedTeam)
      setAdding(false)
      setNewMember(DEFAULT_MEMBER)
    } catch (err) {
      setError('Failed to add team member')
    } finally {
      setSaving(false)
    }
  }
  const handleCancelAdd = () => {
    setAdding(false)
    setNewMember(DEFAULT_MEMBER)
  }

  // Edit member
  const handleEdit = (idx) => {
    setEditingIdx(idx)
    setEditMember({ ...team[idx] })
  }
  const handleSaveEdit = async (idx) => {
    if (!editMember.name || !editMember.role) return
    setSaving(true)
    try {
      const updatedTeam = [...team]
      updatedTeam[idx] = { ...editMember }
      await updateDoc(doc(db, 'projects', projectId), { projectTeam: updatedTeam })
      setTeam(updatedTeam)
      setEditingIdx(null)
      setEditMember(DEFAULT_MEMBER)
    } catch (err) {
      setError('Failed to update team member')
    } finally {
      setSaving(false)
    }
  }
  const handleCancelEdit = () => {
    setEditingIdx(null)
    setEditMember(DEFAULT_MEMBER)
  }

  // Delete member
  const handleDelete = async (idx) => {
    if (!window.confirm('Remove this team member?')) return
    setSaving(true)
    try {
      const updatedTeam = team.filter((_, i) => i !== idx)
      await updateDoc(doc(db, 'projects', projectId), { projectTeam: updatedTeam })
      setTeam(updatedTeam)
    } catch (err) {
      setError('Failed to delete team member')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-80 bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Project Team</h3>
        <div className="flex gap-2">
          <button className="p-1.5 cursor-pointer hover:bg-gray-100 rounded" onClick={handleAdd} disabled={adding || saving}>
            <FiPlus size={18} />
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
      <div className="space-y-3">
        {adding && (
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(newMember.name)}
              </div>
              <div className="flex-1">
                <input type="text" className="border rounded px-2 py-1 w-full mb-1" placeholder="Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} />
                <input type="text" className="border rounded px-2 py-1 w-full" placeholder="Role" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1 [&>*]:cursor-pointer">
                <button className="text-green-600" onClick={handleSaveAdd} disabled={saving}><FiCheck /></button>
                <button className="text-red-600" onClick={handleCancelAdd} disabled={saving}><FiX /></button>
              </div>
            </div>
          </div>
        )}
        {team.map((member, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(member.name)}
              </div>
              <div className="flex-1">
                {editingIdx === idx ? (
                  <>
                    <input type="text" className="border rounded px-2 py-1 w-full mb-1" value={editMember.name} onChange={e => setEditMember({ ...editMember, name: e.target.value })} />
                    <input type="text" className="border rounded px-2 py-1 w-full" value={editMember.role} onChange={e => setEditMember({ ...editMember, role: e.target.value })} />
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {editingIdx === idx ? (
                  <>
                    <button className="text-green-600 cursor-pointer" onClick={() => handleSaveEdit(idx)} disabled={saving}><FiCheck /></button>
                    <button className="text-red-600" onClick={handleCancelEdit} disabled={saving}><FiX /></button>
                  </>
                ) : (
                  <>
                    <button className="text-blue-600 cursor-pointer" onClick={() => handleEdit(idx)} disabled={adding || saving}><FiEdit2 /></button>
                    <button className="text-red-600 cursor-pointer" onClick={() => handleDelete(idx)} disabled={adding || saving}><FiTrash2 /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-xs">Loading...</div>}
        {!loading && team.length === 0 && !adding && <div className="text-gray-400 text-xs">No team members yet.</div>}
      </div>
    </div>
  )
}

export default ProjectTeam
