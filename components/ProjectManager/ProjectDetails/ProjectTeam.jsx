import React, { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiUpload, FiLink } from 'react-icons/fi'
import { db, storage } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const DEFAULT_MEMBER = { name: '', role: '', photo: '' }
const DEFAULT_WHATSAPP_LINK = { name: '', link: '' }

const ProjectTeam = ({ projectId }) => {
  const [team, setTeam] = useState([])
  const [whatsappLinks, setWhatsappLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [newMember, setNewMember] = useState(DEFAULT_MEMBER)
  const [editMember, setEditMember] = useState(DEFAULT_MEMBER)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  // WhatsApp links state
  const [addingLink, setAddingLink] = useState(false)
  const [editingLinkIdx, setEditingLinkIdx] = useState(null)
  const [newLink, setNewLink] = useState(DEFAULT_WHATSAPP_LINK)
  const [editLink, setEditLink] = useState(DEFAULT_WHATSAPP_LINK)

  // Fetch project team and WhatsApp links from Firestore
  useEffect(() => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    const fetchData = async () => {
      try {
        const projectRef = doc(db, 'projects', projectId)
        const projectSnap = await getDoc(projectRef)
        if (projectSnap.exists()) {
          const data = projectSnap.data()
          setTeam(Array.isArray(data.projectTeam) ? data.projectTeam : [])
          setWhatsappLinks(Array.isArray(data.whatsappLinks) ? data.whatsappLinks : [])
        } else {
          setTeam([])
          setWhatsappLinks([])
        }
      } catch (err) {
        setError('Failed to fetch project data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [projectId])

  // Photo upload handler
  const handlePhotoUpload = async (file, isEdit = false) => {
    if (!file) return null
    
    setUploadingPhoto(true)
    try {
      const storageRef = ref(storage, `project-team/${projectId}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(storageRef)
      return photoURL
    } catch (err) {
      setError('Failed to upload photo')
      return null
    } finally {
      setUploadingPhoto(false)
    }
  }

  // Team Member Handlers
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

  const handlePhotoChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const photoURL = await handlePhotoUpload(file, isEdit)
    if (photoURL) {
      if (isEdit) {
        setEditMember({ ...editMember, photo: photoURL })
      } else {
        setNewMember({ ...newMember, photo: photoURL })
      }
    }
  }

  // WhatsApp Links Handlers
  const validateWhatsAppLink = (link) => {
    return link.startsWith('https://chat.whatsapp.com/')
  }

  const handleAddLink = () => {
    setAddingLink(true)
    setNewLink(DEFAULT_WHATSAPP_LINK)
  }

  const handleSaveAddLink = async () => {
    if (!newLink.name || !newLink.link) return
    if (!validateWhatsAppLink(newLink.link)) {
      setError('Please enter a valid WhatsApp group link (https://chat.whatsapp.com/...)')
      return
    }
    setSaving(true)
    try {
      const updatedLinks = [...whatsappLinks, { ...newLink }]
      await updateDoc(doc(db, 'projects', projectId), { whatsappLinks: updatedLinks })
      setWhatsappLinks(updatedLinks)
      setAddingLink(false)
      setNewLink(DEFAULT_WHATSAPP_LINK)
      setError(null)
    } catch (err) {
      setError('Failed to add WhatsApp link')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelAddLink = () => {
    setAddingLink(false)
    setNewLink(DEFAULT_WHATSAPP_LINK)
  }

  const handleEditLink = (idx) => {
    setEditingLinkIdx(idx)
    setEditLink({ ...whatsappLinks[idx] })
  }

  const handleSaveEditLink = async (idx) => {
    if (!editLink.name || !editLink.link) return
    if (!validateWhatsAppLink(editLink.link)) {
      setError('Please enter a valid WhatsApp group link (https://chat.whatsapp.com/...)')
      return
    }
    setSaving(true)
    try {
      const updatedLinks = [...whatsappLinks]
      updatedLinks[idx] = { ...editLink }
      await updateDoc(doc(db, 'projects', projectId), { whatsappLinks: updatedLinks })
      setWhatsappLinks(updatedLinks)
      setEditingLinkIdx(null)
      setEditLink(DEFAULT_WHATSAPP_LINK)
      setError(null)
    } catch (err) {
      setError('Failed to update WhatsApp link')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEditLink = () => {
    setEditingLinkIdx(null)
    setEditLink(DEFAULT_WHATSAPP_LINK)
  }

  const handleDeleteLink = async (idx) => {
    if (!window.confirm('Remove this WhatsApp group link?')) return
    setSaving(true)
    try {
      const updatedLinks = whatsappLinks.filter((_, i) => i !== idx)
      await updateDoc(doc(db, 'projects', projectId), { whatsappLinks: updatedLinks })
      setWhatsappLinks(updatedLinks)
    } catch (err) {
      setError('Failed to delete WhatsApp link')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-80 bg-white rounded-lg p-6">
      {/* Project Team Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Project Team</h3>
          <button 
            className="p-1.5 cursor-pointer hover:bg-gray-100 rounded" 
            onClick={handleAdd} 
            disabled={adding || saving || uploadingPhoto}
          >
            <FiPlus size={18} />
          </button>
        </div>

        {error && <div className="text-red-500 text-xs mb-2">{error}</div>}

        <div className="space-y-3">
          {/* Add New Member */}
          {adding && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-3 mb-2">
                <div className="relative">
                  {newMember.photo ? (
                    <img 
                      src={newMember.photo} 
                      alt="Team member" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(newMember.name)}
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 cursor-pointer border border-gray-300 hover:bg-gray-50">
                    <FiUpload size={10} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handlePhotoChange(e, false)}
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    className="border rounded px-2 py-1 w-full mb-1 text-sm" 
                    placeholder="Name" 
                    value={newMember.name} 
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })} 
                  />
                  <input 
                    type="text" 
                    className="border rounded px-2 py-1 w-full text-sm" 
                    placeholder="Role" 
                    value={newMember.role} 
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })} 
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  className="text-green-600 cursor-pointer p-1 hover:bg-green-50 rounded" 
                  onClick={handleSaveAdd} 
                  disabled={saving || uploadingPhoto}
                >
                  <FiCheck size={16} />
                </button>
                <button 
                  className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                  onClick={handleCancelAdd} 
                  disabled={saving || uploadingPhoto}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Team Members List */}
          {team.map((member, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 w-full">
                {editingIdx === idx ? (
                  <div className="relative">
                    {editMember.photo ? (
                      <img 
                        src={editMember.photo} 
                        alt="Team member" 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(editMember.name)}
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 cursor-pointer border border-gray-300 hover:bg-gray-50">
                      <FiUpload size={10} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handlePhotoChange(e, true)}
                        disabled={uploadingPhoto}
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </>
                )}
                <div className="flex-1">
                  {editingIdx === idx ? (
                    <>
                      <input 
                        type="text" 
                        className="border rounded px-2 py-1 w-full mb-1 text-sm" 
                        value={editMember.name} 
                        onChange={e => setEditMember({ ...editMember, name: e.target.value })} 
                      />
                      <input 
                        type="text" 
                        className="border rounded px-2 py-1 w-full text-sm" 
                        value={editMember.role} 
                        onChange={e => setEditMember({ ...editMember, role: e.target.value })} 
                      />
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
                      <button 
                        className="text-green-600 cursor-pointer p-1 hover:bg-green-50 rounded" 
                        onClick={() => handleSaveEdit(idx)} 
                        disabled={saving || uploadingPhoto}
                      >
                        <FiCheck size={14} />
                      </button>
                      <button 
                        className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                        onClick={handleCancelEdit} 
                        disabled={saving || uploadingPhoto}
                      >
                        <FiX size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="text-blue-600 cursor-pointer p-1 hover:bg-blue-50 rounded" 
                        onClick={() => handleEdit(idx)} 
                        disabled={adding || saving || uploadingPhoto}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button 
                        className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                        onClick={() => handleDelete(idx)} 
                        disabled={adding || saving || uploadingPhoto}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && <div className="text-gray-400 text-xs">Loading...</div>}
          {!loading && team.length === 0 && !adding && (
            <div className="text-gray-400 text-xs text-center py-4">No team members yet.</div>
          )}
        </div>
      </div>

      {/* WhatsApp Groups Section */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">WhatsApp Groups</h3>
          <button 
            className="p-1.5 cursor-pointer hover:bg-gray-100 rounded" 
            onClick={handleAddLink} 
            disabled={addingLink || saving}
          >
            <FiPlus size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Add New Link */}
          {addingLink && (
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="mb-2">
                <input 
                  type="text" 
                  className="border rounded px-2 py-1 w-full mb-2 text-sm" 
                  placeholder="Group Name (e.g., Main Group)" 
                  value={newLink.name} 
                  onChange={e => setNewLink({ ...newLink, name: e.target.value })} 
                />
                <input 
                  type="text" 
                  className="border rounded px-2 py-1 w-full text-sm" 
                  placeholder="https://chat.whatsapp.com/..." 
                  value={newLink.link} 
                  onChange={e => setNewLink({ ...newLink, link: e.target.value })} 
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  className="text-green-600 cursor-pointer p-1 hover:bg-green-50 rounded" 
                  onClick={handleSaveAddLink} 
                  disabled={saving}
                >
                  <FiCheck size={16} />
                </button>
                <button 
                  className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                  onClick={handleCancelAddLink} 
                  disabled={saving}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Links List */}
          {whatsappLinks.map((link, idx) => (
            <div key={idx} className="p-3 hover:bg-gray-50 rounded-lg">
              {editingLinkIdx === idx ? (
                <>
                  <div className="mb-2">
                    <input 
                      type="text" 
                      className="border rounded px-2 py-1 w-full mb-2 text-sm" 
                      value={editLink.name} 
                      onChange={e => setEditLink({ ...editLink, name: e.target.value })} 
                    />
                    <input 
                      type="text" 
                      className="border rounded px-2 py-1 w-full text-sm" 
                      value={editLink.link} 
                      onChange={e => setEditLink({ ...editLink, link: e.target.value })} 
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="text-green-600 cursor-pointer p-1 hover:bg-green-50 rounded" 
                      onClick={() => handleSaveEditLink(idx)} 
                      disabled={saving}
                    >
                      <FiCheck size={16} />
                    </button>
                    <button 
                      className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                      onClick={handleCancelEditLink} 
                      disabled={saving}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <FiLink className="text-green-600" size={16} />
                    <div>
                      <div className="text-sm font-semibold">{link.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[180px]">{link.link}</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      className="text-blue-600 cursor-pointer p-1 hover:bg-blue-50 rounded" 
                      onClick={() => handleEditLink(idx)} 
                      disabled={addingLink || saving}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button 
                      className="text-red-600 cursor-pointer p-1 hover:bg-red-50 rounded" 
                      onClick={() => handleDeleteLink(idx)} 
                      disabled={addingLink || saving}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {!loading && whatsappLinks.length === 0 && !addingLink && (
            <div className="text-gray-400 text-xs text-center py-4">No WhatsApp groups yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectTeam