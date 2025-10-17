"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  FiArrowLeft,
  FiFilter,
  FiDownload,
  FiEye,
  FiStar,
  FiSearch,
  FiChevronDown,
  FiClock,
  FiFile,
  FiX,
} from "react-icons/fi"
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFolder,
  FaFileContract,
  FaBuilding,
  FaFileInvoice,
  FaChartBar,
  FaCamera,
} from "react-icons/fa"
import { useDocuments } from "@/contexts/DocumentsContext"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"
import ActionRequiredCard from "@/components/Dashboard/Documents/ActionRequiredCard"

export default function ProjectDocuments() {
  const params = useParams()
  const router = useRouter()
  const projectId = params['document-id']
  
  const { projects, loading: projectsLoading } = usePersonalProjects()
  const { projectDocuments, loading: docsLoading } = useDocuments()
  
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  // Get current project and documents
  const currentProject = projects.find(p => p.id === projectId)
  const documents = projectDocuments[projectId]?.documents || []
  const pendingApproval = projectDocuments[projectId]?.pendingApproval || []

  // Document viewer functions
  const openDocumentViewer = (doc) => {
    setSelectedDocument(doc)
    setViewerOpen(true)
  }

  const closeDocumentViewer = () => {
    setSelectedDocument(null)
    setViewerOpen(false)
  }

  const handleDownload = async (doc) => {
    try {
      const downloadUrl = doc.url || doc.downloadURL
      if (downloadUrl) {
        // For direct download links
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = doc.name || doc.fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert('Download URL not available for this document')
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  // Get unique categories from documents
  const getCategories = () => {
    const categoriesMap = {}
    documents.forEach(doc => {
      const category = doc.category || "uncategorized"
      if (!categoriesMap[category]) {
        categoriesMap[category] = []
      }
      categoriesMap[category].push(doc)
    })
    return categoriesMap
  }

  const categorizedDocs = getCategories()

  // Define category icons and labels
  const categoryConfig = {
    law: { label: "Law", icon: FaFileContract },
    contracts: { label: "Contracts & Legal", icon: FaFileContract },
    architectural: { label: "Architectural Plans", icon: FaBuilding },
    invoices: { label: "Invoices & Receipts", icon: FaFileInvoice },
    reports: { label: "Reports", icon: FaChartBar },
    photos: { label: "Photos & Videos", icon: FaCamera },
  }

  // Build tabs dynamically
  const tabs = [
    { id: "all", label: "All Documents", count: documents.length, icon: FaFolder },
    ...Object.keys(categorizedDocs).map(cat => ({
      id: cat,
      label: categoryConfig[cat]?.label || cat.charAt(0).toUpperCase() + cat.slice(1),
      count: categorizedDocs[cat].length,
      icon: categoryConfig[cat]?.icon || FiFile
    }))
  ]

  const getFileIcon = (fileName, fileType) => {
    const iconClass = "text-2xl"
    const ext = fileType || fileName?.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case "pdf":
        return <FaFilePdf className={`${iconClass} text-red-500`} />
      case "doc":
      case "docx":
        return <FaFileWord className={`${iconClass} text-blue-500`} />
      case "xls":
      case "xlsx":
        return <FaFileExcel className={`${iconClass} text-green-500`} />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className={`${iconClass} text-purple-500`} />
      case "zip":
        return <FaFileImage className={`${iconClass} text-yellow-500`} />
      case "mp4":
      case "mov":
      case "avi":
        return <FaFileVideo className={`${iconClass} text-purple-600`} />
      default:
        return <FiFile className={`${iconClass} text-gray-500`} />
    }
  }

  const getAllDocuments = () => {
    return documents
  }

  const getDocumentsByTab = () => {
    if (activeTab === "all") return getAllDocuments()
    return categorizedDocs[activeTab] || []
  }

  if (projectsLoading || docsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="text-gray-600 ml-3">Loading documents...</p>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Project not found</p>
          <button
            onClick={() => router.push('/dashboard/documents')}
            className="text-orange-500 cursor-pointer hover:text-orange-600 font-medium"
          >
            ← Back to Documents
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Back Button & Title */}
        <div className="mb-6">
          <button 
            onClick={() => router.push('/dashboard/documents')}
            className="flex cursor-pointer items-center gap-2 text-orange-500 mb-3 hover:text-orange-600"
          >
            <FiArrowLeft />
            <span className="text-sm font-medium">Back to Documents</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {currentProject.projectName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Project Documents</p>
        </div>

        {/* Action Required Card - Shows only Pending Approval documents */}
        <ActionRequiredCard 
          getFileIcon={getFileIcon}
          pendingDocs={documents} // Pass all documents, component filters for "Pending Approval"
          onView={openDocumentViewer}
          onDownload={handleDownload}
        />

        {/* Search & Filter Bar - Desktop layout */}
        <div className="hidden lg:flex items-center justify-end gap-3 mb-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSearch className="text-gray-600 text-lg" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiFilter />
            Filter
            <FiChevronDown className="text-xs" />
          </button>
        </div>

        {/* Tabs - Responsive design */}
        <div className="mb-6">
          {/* Desktop Tabs */}
          <div className="hidden lg:block">
            <div className="flex [&>*]:cursor-pointer items-center gap-2 border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                      activeTab === tab.id ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="text-base" />
                    {tab.label}
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile Filter Button & Tabs */}
          <div className="lg:hidden">
            <div className="flex justify-end mb-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
                <FiFilter />
                Filter
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 pb-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeTab === tab.id ? "bg-orange-500 text-white" : "bg-white text-gray-700 border border-gray-300"
                    }`}
                  >
                    {tab.label === "All Documents" ? "All" : tab.label.split(" ")[0]}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:space-y-8">
          {documents.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <FiFile className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg">No documents found</p>
              <p className="text-gray-500 text-sm">Documents will appear here once they're uploaded</p>
            </div>
          ) : activeTab === "all" ? (
            <>
              {Object.entries(categorizedDocs).map(([category, docs]) => {
                const categoryLabel = categoryConfig[category]?.label || 
                  category.charAt(0).toUpperCase() + category.slice(1)
                
                return (
                  <DocumentSection 
                    key={category}
                    title={categoryLabel} 
                    documents={docs} 
                    getFileIcon={getFileIcon}
                    onView={openDocumentViewer}
                    onDownload={handleDownload}
                  />
                )
              })}
            </>
          ) : (
            <DocumentSection
              title={tabs.find((t) => t.id === activeTab)?.label}
              documents={getDocumentsByTab()}
              getFileIcon={getFileIcon}
              onView={openDocumentViewer}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewerOpen && selectedDocument && (
        <DocumentViewerModal
          document={selectedDocument}
          onClose={closeDocumentViewer}
          onDownload={handleDownload}
          getFileIcon={getFileIcon}
        />
      )}
    </div>
  )
}

// DocumentSection and DocumentViewerModal components remain the same as before...
function DocumentSection({ title, documents, getFileIcon, onView, onDownload }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    return `Uploaded ${dateString}`
  }

  if (!documents || documents.length === 0) {
    return null
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gray-400 rounded"></div>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getFileIcon(doc.name, doc.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{doc.name}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {formatDate(doc.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFile className="w-3 h-3" />
                      {doc.size || "Unknown size"}
                    </span>
                  </div>
                  {/* Document status badge */}
                  {doc.status && doc.status !== "Uploaded" && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      doc.status === 'approved' || doc.statusColor === 'green' ? 'bg-green-100 text-green-800' :
                      doc.status === 'pending' || doc.statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      doc.status === 'rejected' || doc.statusColor === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>
                  )}
                  {/* Uploader info */}
                  {doc.uploader && (
                    <p className="text-xs text-gray-500 mt-1">
                      Uploaded by {doc.uploader} ({doc.uploaderRole})
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 opacity-70 group-hover:opacity-100 transition-opacity">
                {doc.url ? (
                  <>
                    <button
                      onClick={() => onView(doc)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Document"
                    >
                      <FiEye className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDownload(doc)}
                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                      title="Download Document"
                    >
                      <FiDownload className="text-orange-500" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-50 cursor-not-allowed"
                      title="View not available"
                      disabled
                    >
                      <FiEye className="text-gray-400" />
                    </button>
                    <button 
                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors opacity-50 cursor-not-allowed"
                      title="Download not available"
                      disabled
                    >
                      <FiDownload className="text-orange-300" />
                    </button>
                  </>
                )}
                <button className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <FiStar className="text-orange-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DocumentViewerModal({ document, onClose, onDownload, getFileIcon }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isImage = () => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']
    const ext = document.type || document.name?.split('.').pop()?.toLowerCase()
    return imageExtensions.includes(ext)
  }

  const isPDF = () => {
    const ext = document.type || document.name?.split('.').pop()?.toLowerCase()
    return ext === 'pdf'
  }

  const handleLoad = () => {
    setIsLoading(false)
    setError(null)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to load document')
  }

  useEffect(() => {
    // Reset loading state when document changes
    setIsLoading(true)
    setError(null)
  }, [document])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(document.name, document.type)}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{document.name}</h3>
              <p className="text-sm text-gray-500">
                {document.category} • {document.size} • {document.date}
              </p>
              {document.uploader && (
                <p className="text-xs text-gray-500">Uploaded by {document.uploader} ({document.uploaderRole})</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onDownload(document)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FiDownload className="text-sm" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">Loading document...</span>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">⚠️ {error}</div>
              <p className="text-gray-500 mb-4">Please try downloading the document instead.</p>
              <button
                onClick={() => onDownload(document)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
              >
                <FiDownload />
                Download Document
              </button>
            </div>
          )}

          {!error && document.url && (
            <div className="w-full h-full flex items-center justify-center">
              {isImage() ? (
                <div className="text-center">
                  <img
                    src={document.url}
                    alt={document.name}
                    className="max-w-full max-h-[70vh] mx-auto rounded-lg"
                    onLoad={handleLoad}
                    onError={handleError}
                  />
                  <p className="text-sm text-gray-500 mt-2">Scroll to zoom, click and drag to pan</p>
                </div>
              ) : isPDF() ? (
                <div className="w-full h-full">
                  <iframe
                    src={document.url}
                    className="w-full h-full min-h-[500px] rounded-lg border"
                    title={document.name}
                    onLoad={handleLoad}
                    onError={handleError}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">
                    {getFileIcon(document.name, document.type)}
                  </div>
                  <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                  <button
                    onClick={() => onDownload(document)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mx-auto"
                  >
                    <FiDownload />
                    Download to View
                  </button>
                </div>
              )}
            </div>
          )}

          {!error && !document.url && (
            <div className="text-center py-8">
              <div className="text-6xl text-gray-300 mb-4">
                {getFileIcon(document.name, document.type)}
              </div>
              <p className="text-gray-500 mb-4">Document URL not available</p>
              <p className="text-sm text-gray-400">
                This document cannot be viewed or downloaded at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}