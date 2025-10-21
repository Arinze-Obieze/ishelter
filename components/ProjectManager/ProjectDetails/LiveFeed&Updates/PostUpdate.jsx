"use client"

import { useState, useEffect } from "react"
import { FiUpload, FiX } from "react-icons/fi"
import { MdCheckCircle } from "react-icons/md"
import { useLiveFeed } from "@/contexts/LiveFeedContext"
import { toast } from "react-hot-toast"

export default function PostUpdateForm({ projectId }) {
  const [description, setDescription] = useState("")
  const [updateType, setUpdateType] = useState("")
  const [customType, setCustomType] = useState("")
  const [showCustomType, setShowCustomType] = useState(false)
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const [existingTypes, setExistingTypes] = useState([])
  const { postUpdate, uploadFiles, getUpdateTypes, loading } = useLiveFeed()

  // Fetch existing update types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      const types = await getUpdateTypes(projectId)
      setExistingTypes(types)
    }
    fetchTypes()
  }, [projectId, getUpdateTypes])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
    const invalidFiles = selectedFiles.filter(f => !validTypes.includes(f.type))
    
    if (invalidFiles.length > 0) {
      toast.error(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    setFiles(selectedFiles)
    setUploadProgress(Array(selectedFiles.length).fill(0))
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
    setUploadProgress(uploadProgress.filter((_, i) => i !== index))
  }

  const handleTypeChange = (e) => {
    const value = e.target.value
    if (value === "__add_new__") {
      setShowCustomType(true)
      setUpdateType("")
    } else {
      setShowCustomType(false)
      setUpdateType(value)
      setCustomType("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Determine final update type
    const finalType = showCustomType ? customType.trim() : updateType
    
    // Validation
    if (!description.trim()) {
      toast.error("Please enter an update description")
      return
    }
    
    if (!finalType) {
      toast.error("Please select or enter an update type")
      return
    }

    // Check if custom type already exists (case-insensitive)
    if (showCustomType) {
      const typeExists = existingTypes.some(
        t => t.toLowerCase() === finalType.toLowerCase()
      )
      if (typeExists) {
        toast.error("This update type already exists. Please select it from the dropdown.")
        return
      }
    }

    try {
      // Upload files first if any
      let media = []
      if (files.length > 0) {
        media = await uploadFiles(files, projectId, (idx, prog) => {
          setUploadProgress(prev => {
            const next = [...prev]
            next[idx] = prog
            return next
          })
        })
      }

      // Post update
      await postUpdate({ 
        projectId, 
        description: description.trim(), 
        updateType: finalType, 
        media 
      })

      // Reset form
      setDescription("")
      setUpdateType("")
      setCustomType("")
      setShowCustomType(false)
      setFiles([])
      setUploadProgress([])
      
      // Refresh types list
      const types = await getUpdateTypes(projectId)
      setExistingTypes(types)
      
      // Reset file input
      const fileInput = document.getElementById("file-upload")
      if (fileInput) fileInput.value = ""
    } catch (err) {
      // Error already handled in context with toast
      console.error("Submit error:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-primary rounded-lg p-4 md:p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MdCheckCircle className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Post New Update</h2>
      </div>

      {/* Form Content */}
      <div className="space-y-4 md:space-y-6">
        {/* Update Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter update description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Update Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Type <span className="text-red-500">*</span>
          </label>
          
          {!showCustomType ? (
            <select
              value={updateType}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              disabled={loading}
            >
              <option value="">Select update type...</option>
              {existingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
              <option value="__add_new__" className="font-semibold text-primary">
                + Add New Type
              </option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Enter new update type..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowCustomType(false)
                  setCustomType("")
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload (Optional)</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/gif,video/mp4,video/quicktime,video/webm"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center flex flex-col items-center justify-center hover:border-primary transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drop photos and videos here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, GIF, MP4, MOV, WEBM (all sizes)</p>
          </label>
          
          {/* File Preview */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
              {files.map((file, idx) => (
                <div key={idx} className="relative border rounded-lg p-2 bg-gray-50">
                  {file.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-600">Video</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={loading}
                  >
                    <FiX size={14} />
                  </button>
                  <div className="mt-1 text-xs text-gray-600 truncate">{file.name}</div>
                  {uploadProgress[idx] > 0 && uploadProgress[idx] < 1 && (
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{ width: `${uploadProgress[idx] * 100}%` }}
                      />
                    </div>
                  )}
                  <div className="mt-1 text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Post Update Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MdCheckCircle className="w-5 h-5" />
          {loading ? "Posting..." : "Post Update"}
        </button>
      </div>
    </form>
  )
}