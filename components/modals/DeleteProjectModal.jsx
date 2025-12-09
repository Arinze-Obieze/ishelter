"use client"

import { useState } from "react"
import { FiX, FiAlertTriangle, FiTrash2 } from "react-icons/fi"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function DeleteProjectModal({ isOpen, onClose, project, onDelete }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirmText, setConfirmText] = useState("")

  const handleDelete = async () => {
    if (confirmText !== project?.projectName) {
      setError("Project name doesn't match. Please type the exact project name.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const projectRef = doc(db, "projects", project.id)
      await deleteDoc(projectRef)
      
      if (onDelete) {
        onDelete()
      }
      
      handleClose()
    } catch (err) {
      console.error("Error deleting project:", err)
      setError(err.message || "Failed to delete project. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmText("")
    setError("")
    onClose()
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed backdrop-overlay z-50 flex items-center justify-center  p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <FiAlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Project</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            disabled={loading}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-6">
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete <strong>{project.projectName}</strong>? 
              This action cannot be undone and will permanently remove:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 text-sm text-gray-600">
              <li>All project information and settings</li>
              <li>Project timeline and milestones</li>
              <li>Associated live updates</li>
              <li>Project documents and files</li>
              <li>All related data</li>
            </ul>
            <div className="rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> This is a destructive action that cannot be reversed. 
                Please make sure you have backed up any important data before proceeding.
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Type <strong>{project.projectName}</strong> to confirm deletion
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none"
              placeholder="Enter project name"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading || confirmText !== project.projectName}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 size={16} />
                  Delete Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}