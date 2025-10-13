"use client"

import { useState } from "react"
import {
  FiArrowLeft,
  FiFilter,
  FiMenu,
  FiBell,
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
import ActionRequiredCard from "@/components/Dashboard/Documents/ActionRequiredCard"

export default function ProjectDocuments() {
  const [activeTab, setActiveTab] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

 

  const documents = {
    contracts: [
      {
        name: "Initial-Client-Agreement.pdf",
        uploadDate: "Uploaded Jun 15, 2023",
        size: "2.4 MB",
        type: "pdf",
      },
      {
        name: "Terms-and-Conditions.pdf",
        uploadDate: "Uploaded Jun 12, 2023",
        size: "1.8 MB",
        type: "pdf",
      },
    ],
    architectural: [
      {
        name: "Floor-Plan-Ground-Level.pdf",
        uploadDate: "Uploaded Jun 15, 2023",
        size: "4.7 MB",
        type: "pdf",
      },
      {
        name: "Electrical-Layout-V2.pdf",
        uploadDate: "Uploaded Jun 18, 2023",
        size: "3.9 MB",
        type: "pdf",
      },
      {
        name: "Plumbing-Schematic.pdf",
        uploadDate: "Uploaded Jun 20, 2023",
        size: "3.2 MB",
        type: "pdf",
      },
    ],
    invoices: [
      {
        name: "Invoice-001-Initial-Payment.pdf",
        uploadDate: "Uploaded Jun 8, 2023",
        size: "1.1 MB",
        type: "pdf",
      },
      {
        name: "Project-Cost-Breakdown.xlsx",
        uploadDate: "Uploaded Jun 25, 2023",
        size: "0.9 MB",
        type: "excel",
      },
    ],
    reports: [
      {
        name: "Site-Inspection-Report-June.docx",
        uploadDate: "Uploaded Jun 30, 2023",
        size: "2.3 MB",
        type: "word",
      },
    ],
    photos: [
      {
        name: "Site-Progress-Photos-Week1.zip",
        uploadDate: "Uploaded Jun 15, 2023",
        size: "45.7 MB",
        type: "image",
      },
      {
        name: "Foundation-Pouring-Video.mp4",
        uploadDate: "Uploaded Jun 25, 2023",
        size: "182.1 MB",
        type: "video",
      },
    ],
  }

  const tabs = [
    { id: "all", label: "All Documents", count: 10, icon: FaFolder },
    { id: "contracts", label: "Contracts & Legal", count: 2, icon: FaFileContract },
    { id: "architectural", label: "Architectural Plans", count: 3, icon: FaBuilding },
    { id: "invoices", label: "Invoices & Receipts", count: 2, icon: FaFileInvoice },
    { id: "reports", label: "Reports", count: 1, icon: FaChartBar },
    { id: "photos", label: "Photos & Videos", count: 2, icon: FaCamera },
  ]

  const getFileIcon = (type) => {
    const iconClass = "text-2xl"
    switch (type) {
      case "pdf":
        return <FaFilePdf className={`${iconClass} text-red-500`} />
      case "word":
        return <FaFileWord className={`${iconClass} text-blue-500`} />
      case "excel":
        return <FaFileExcel className={`${iconClass} text-green-500`} />
      case "image":
        return <FaFileImage className={`${iconClass} text-purple-500`} />
      case "video":
        return <FaFileVideo className={`${iconClass} text-purple-600`} />
      default:
        return <FaFilePdf className={`${iconClass} text-gray-500`} />
    }
  }

  const getAllDocuments = () => {
    return [
      ...documents.contracts,
      ...documents.architectural,
      ...documents.invoices,
      ...documents.reports,
      ...documents.photos,
    ]
  }

  const getDocumentsByTab = () => {
    if (activeTab === "all") return getAllDocuments()
    if (activeTab === "contracts") return documents.contracts
    if (activeTab === "architectural") return documents.architectural
    if (activeTab === "invoices") return documents.invoices
    if (activeTab === "reports") return documents.reports
    if (activeTab === "photos") return documents.photos
    return []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Shows only on mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-semibold">SHELTER</div>
        <div className="flex items-center gap-4">
          <FiBell className="text-xl text-gray-600" />
          <FiMenu className="text-xl text-gray-600" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Back Button & Title */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-orange-500 mb-3 hover:text-orange-600">
            <FiArrowLeft />
            <span className="text-sm font-medium">Back to Project Details</span>
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Duplex at Lekki</h1>
          <p className="text-sm text-gray-500 mt-1">Project Documents</p>
        </div>

      <ActionRequiredCard getFileIcon={getFileIcon} />

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
                    className={`flex  items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
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
          {activeTab === "all" ? (
            <>
              <DocumentSection title="Contracts & Legal" documents={documents.contracts} getFileIcon={getFileIcon} />
              <DocumentSection
                title="Architectural Plans"
                documents={documents.architectural}
                getFileIcon={getFileIcon}
              />
              <DocumentSection title="Invoices & Receipts" documents={documents.invoices} getFileIcon={getFileIcon} />
              <DocumentSection title="Reports" documents={documents.reports} getFileIcon={getFileIcon} />
              <DocumentSection title="Photos & Videos" documents={documents.photos} getFileIcon={getFileIcon} />
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
              <div className="flex items-center gap-2 ml-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiEye className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-orange-50 rounded-lg transition-colors">
                  <FiDownload className="text-orange-500" />
                </button>
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