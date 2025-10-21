"use client"

import { useState } from "react"
import { FiUpload, FiSend } from "react-icons/fi"
import { MdCheckCircle } from "react-icons/md"
import { useLiveFeed } from "@/contexts/LiveFeedContext"

export default function PostUpdateForm({ projectId }) {
  const [isInternal, setIsInternal] = useState(true)
  const [description, setDescription] = useState("")
  const [updateType, setUpdateType] = useState("")
  const [postInput, setPostInput] = useState("")
  const [files, setFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const { postUpdate, uploadFiles, loading, error } = useLiveFeed()

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
    setUploadProgress(Array(e.target.files.length).fill(0))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description || !updateType || files.some(f => f.size > 50 * 1024 * 1024)) return
    try {
      // Upload files
      const media = await uploadFiles(files, projectId, (idx, prog) => {
        setUploadProgress(prev => {
          const next = [...prev]
          next[idx] = prog
          return next
        })
      })
      // Post update
      await postUpdate({ projectId, description, updateType, isInternal, media })
      setDescription("")
      setUpdateType("")
      setFiles([])
      setUploadProgress([])
    } catch (err) {
      // handle error
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Update Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter update description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            rows={3}
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Media Upload</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,video/mp4,video/quicktime"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center flex flex-col items-center justify-center"
          >
            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drop photos and videos here or click to browse</p>
            <p className="text-xs text-gray-400 mt-1">Supported: JPG, PNG, MP4, MOV up to 50MB</p>
          </label>
          <div className="flex flex-wrap gap-2 mt-2">
            {files.map((file, idx) => (
              <div key={idx} className="border rounded p-2 text-xs">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover"
                  />
                ) : (
                  <span>{file.name}</span>
                )}
                <div>Progress: {(uploadProgress[idx] * 100).toFixed(0)}%</div>
                {file.size > 50 * 1024 * 1024 && (
                  <div className="text-red-500">File too large</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Update Type and Visibility - Mobile */}
        <div className="md:hidden space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Type</label>
            <input
              type="text"
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
              placeholder="Select update type..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Internal Only</span>
              <button
                onClick={() => setIsInternal(!isInternal)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isInternal ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isInternal ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">Client Visible</span>
            </div>
          </div>
        </div>

        {/* Update Type and Visibility - Desktop */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Type</label>
            <input
              type="text"
              value={updateType}
              onChange={(e) => setUpdateType(e.target.value)}
              placeholder="Select update type..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Internal Only</span>
              <button
                onClick={() => setIsInternal(!isInternal)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isInternal ? "bg-primary" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isInternal ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">Client Visible</span>
            </div>
          </div>
        </div>

        {/* Post Update Button */}
        <button
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <MdCheckCircle className="w-5 h-5" />
          {loading ? "Posting..." : "Post Update"}
        </button>
        {error && <div className="text-red-500 mt-2">{error.message}</div>}
      </div>

   
    </form>
  )
}
