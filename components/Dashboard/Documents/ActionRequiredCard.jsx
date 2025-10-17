import React from 'react'
import { FiClock, FiFile, FiEye, FiDownload } from 'react-icons/fi'

const ActionRequiredCard = ({ getFileIcon, pendingDocs, onView, onDownload }) => {
  const actionRequiredDocs = pendingDocs.filter(doc => 
    doc.status === "Pending Approval" || doc.status === "pending approval"
  )

  if (actionRequiredDocs.length === 0) {
    return null
  }

  const handleReview = (doc) => {
    console.log("Reviewing document:", doc.name)
    if (onView) {
      onView(doc)
    }
  }

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 lg:p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-orange-500 rounded-full p-1 mt-0.5">
          <div className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold">!</div>
        </div>
        <h2 className="text-base lg:text-lg font-semibold text-gray-900">
          Action Required ({actionRequiredDocs.length} {actionRequiredDocs.length === 1 ? "Document" : "Documents"})
        </h2>
      </div>

      <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4">
        {actionRequiredDocs.map((doc, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              {getFileIcon(doc.name, doc.type)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{doc.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {doc.date || doc.uploadDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiFile className="w-3 h-3" />
                    {doc.size || "Unknown size"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleReview(doc)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Review & Approve
              </button>
              {doc.url && (
                <>
                  <button
                    onClick={() => onView && onView(doc)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors border"
                    title="View Document"
                  >
                    <FiEye className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => onDownload && onDownload(doc)}
                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors border"
                    title="Download Document"
                  >
                    <FiDownload className="text-orange-500" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ActionRequiredCard