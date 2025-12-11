"use client"

import { useState, useEffect } from "react"
import { FiX, FiSave, FiUser } from "react-icons/fi"
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function EditProjectModal({ isOpen, onClose, project, onUpdate }) {
  const [formData, setFormData] = useState({
    projectName: "",
    projectAddress: "",
    projectStatus: "",
    initialBudget: "",
    startDate: "",
    completionDate: "",
    projectManager: ""
  })
  const [projectManagers, setProjectManagers] = useState([])
  const [currentManagerName, setCurrentManagerName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingManagers, setLoadingManagers] = useState(true)

  // Fetch project managers
  useEffect(() => {
    const fetchProjectManagers = async () => {
      try {
        setLoadingManagers(true)
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("role", "==", "project manager"))
        const snapshot = await getDocs(q)
        
        const managers = snapshot.docs.map(doc => ({
          id: doc.id,
          displayName: doc.data().displayName || doc.data().email,
          email: doc.data().email
        }))
        
        setProjectManagers(managers)
      } catch (err) {
        console.error("Error fetching project managers:", err)
      } finally {
        setLoadingManagers(false)
      }
    }

    if (isOpen) {
      fetchProjectManagers()
    }
  }, [isOpen])

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || "",
        projectAddress: project.projectAddress || "",
        projectStatus: project.projectStatus || "",
        initialBudget: project.initialBudget || "",
        startDate: project.startDate || "",
        completionDate: project.completionDate || "",
        projectManager: project.projectManager?.id || ""
      })
      
      // Set current manager name for display
      const currentManagerId = project.projectManager?.id
      if (currentManagerId && projectManagers.length > 0) {
        const manager = projectManagers.find(m => m.id === currentManagerId)
        setCurrentManagerName(manager ? `${manager.displayName} (${manager.email})` : "Unknown")
      }
    }
  }, [project, projectManagers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const projectRef = doc(db, "projects", project.id)
      
      const updateData = {
        projectName: formData.projectName,
        projectAddress: formData.projectAddress,
        projectStatus: formData.projectStatus,
        initialBudget: formData.initialBudget,
        startDate: formData.startDate,
        completionDate: formData.completionDate,
        updatedAt: new Date().toISOString()
      }

      // Only update project manager if changed
      if (formData.projectManager && formData.projectManager !== project.projectManager?.id) {
        updateData.projectManager = doc(db, "users", formData.projectManager)
      }

      await updateDoc(projectRef, updateData)
      
      if (onUpdate) {
        onUpdate()
      }
      
      onClose()
    } catch (err) {
      console.error("Error updating project:", err)
      setError(err.message || "Failed to update project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed backdrop-overlay  z-50 flex items-center justify-center  p-4">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Project</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Name */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Name *
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Address */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Address *
              </label>
              <input
                type="text"
                name="projectAddress"
                value={formData.projectAddress}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                placeholder="Enter project address"
              />
            </div>

            {/* Project Status */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Status *
              </label>
              <select
                name="projectStatus"
                value={formData.projectStatus}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select status</option>
                <option value="pending">Pending Kickoff</option>
                <option value="inProgress">In Progress</option>
                <option value="onHold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Initial Budget (₦) *
              </label>
              <input
                type="number"
                name="initialBudget"
                value={formData.initialBudget}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                placeholder="Enter budget"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Completion Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Est. Completion Date *
              </label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Project Manager */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Assign Project Manager *
              </label>
              {loadingManagers ? (
                <div className="flex items-center justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentManagerName && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Current Manager</p>
                      <p className="text-sm font-medium text-blue-900">{currentManagerName}</p>
                    </div>
                  )}
                  <select
                    name="projectManager"
                    value={formData.projectManager}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">-- Change Manager --</option>
                    {projectManagers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.displayName} ({manager.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  Update Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}