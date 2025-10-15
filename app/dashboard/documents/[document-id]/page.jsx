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
  
  // Get current project and documents
  const currentProject = projects.find(p => p.id === projectId)
  const documents = projectDocuments[projectId]?.documents || []
  const pendingApproval = projectDocuments[projectId]?.pendingApproval || []

  // Get unique categories from documents
  const getCategories = () => {
    const categoriesMap = {}
    documents.forEach(doc => {
      if (doc.category) {
        if (!categoriesMap[doc.category]) {
          categoriesMap[doc.category] = []
        }
        categoriesMap[doc.category].push(doc)
      }
    })
    return categoriesMap
  }

  const categorizedDocs = getCategories()

  // Define category icons and labels
  const categoryConfig = {
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

  const getFileIcon = (fileName) => {
    const iconClass = "text-2xl"
    const ext = fileName?.split('.').pop()?.toLowerCase()
    
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
      case "zip":
        return <FaFileImage className={`${iconClass} text-purple-500`} />
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
        <p className="text-gray-600">Loading documents...</p>
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

        <ActionRequiredCard getFileIcon={getFileIcon} pendingDocs={pendingApproval} />

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
                  />
                )
              })}
            </>
          ) : (
            <DocumentSection
              title={tabs.find((t) => t.id === activeTab)?.label}
              documents={getDocumentsByTab()}
              getFileIcon={getFileIcon}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function DocumentSection({ title, documents, getFileIcon }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date"
    try {
      const date = timestamp.toDate?.() || new Date(timestamp)
      return `Uploaded ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`
    } catch {
      return "Unknown date"
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown size"
    const mb = bytes / (1024 * 1024)
    return mb.toFixed(1) + " MB"
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
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getFileIcon(doc.fileName)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{doc.fileName}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {formatDate(doc.uploadDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiFile className="w-3 h-3" />
                      {formatSize(doc.size)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {doc.downloadURL ? (
                  <>
                    <a
                      href={doc.downloadURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiEye className="text-gray-600" />
                    </a>
                    <a
                      href={doc.downloadURL}
                      download={doc.fileName}
                      className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <FiDownload className="text-orange-500" />
                    </a>
                  </>
                ) : (
                  <>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiEye className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
                      <FiDownload className="text-orange-500" />
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