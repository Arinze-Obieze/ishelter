import React from 'react'
import { FiClock, FiFile } from 'react-icons/fi'

const ActionRequiredCard = ({getFileIcon}) => {
    const actionRequiredDocs = [
        {
          name: "Contract-Agreement-Final.pdf",
          uploadDate: "Uploaded 2 days ago",
          size: "1.2 MB",
          type: "pdf",
        },
        {
          name: "Change-Order-Request-01.docx",
          uploadDate: "Uploaded today",
          size: "1.5 MB",
          type: "word",
        },
      ]
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
                    {getFileIcon(doc.type)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{doc.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {doc.uploadDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiFile className="w-3 h-3" />
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors">
                    Review & Approve
                  </button>
                </div>
              ))}
            </div>
          </div>
  )
}

export default ActionRequiredCard
