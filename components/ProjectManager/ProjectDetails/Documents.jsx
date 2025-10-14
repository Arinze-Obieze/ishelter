"use client"
import { useProjects } from '@/contexts/ProjectContext';
import { useUsers } from '@/contexts/UserContext';
import { useEffect, useState } from "react"
import {
  AiOutlineFolder,
  AiOutlineFilePdf,
  AiOutlineFileZip,
  AiOutlineFile,
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineCloudUpload,
} from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
import { IoChevronForward, IoChevronDown } from "react-icons/io5"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Breadcrumbs from './Breadcrumbs'
import TabsNavigation from './TabsNavigation';

export default function DocumentsTab({ projectId, tabs, activeTab, onTabChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { projects } = useProjects();
  const { users } = useUsers();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // Find the project in global context
    const project = projects.find((p) => p.id === projectId);
    setDocuments(project?.documents || []);
  }, [projects, projectId, isUploading]);

  const getFileIcon = (type) => {
    switch (type) {
      case "folder":
        return (
          <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
            <AiOutlineFolder className="w-3 h-3 text-white" />
          </div>
        )
      case "pdf":
        return (
          <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
            <AiOutlineFilePdf className="w-3 h-3 text-white" />
          </div>
        )
      case "zip":
        return (
          <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
            <AiOutlineFileZip className="w-3 h-3 text-white" />
          </div>
        )
      case "dwg":
        return (
          <div className="w-5 h-5 bg-cyan-500 rounded flex items-center justify-center">
            <AiOutlineFile className="w-3 h-3 text-white" />
          </div>
        )
      default:
        return null
    }
  }

  const getStatusBadge = (status, color) => {
    const colorClasses = {
      gray: "bg-gray-100 text-gray-700",
      orange: "bg-orange-50 text-orange-700",
      green: "bg-green-100 text-green-700",
    }

    return <span className={`px-3 py-1 rounded text-sm font-medium ${colorClasses[color]}`}>{status}</span>
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `projects/${projectId}/documents/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Get logged-in user (project manager)
        const user = users && users.length > 0 ? users[0] : { name: 'Project Manager', role: 'Manager' };

        // Add document metadata to Firestore project's documents array
        const newDocument = {
          name: file.name,
          type: file.type.split("/").pop(),
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploader: user.name || 'Project Manager',
          uploaderRole: user.role || 'Manager',
          date: new Date().toLocaleString(),
          status: "Uploaded",
          statusColor: "green",
          url: downloadURL,
        };
        const projectRef = doc(db, "projects", projectId);
        await updateDoc(projectRef, {
          documents: arrayUnion(newDocument),
        });
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploader.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="px-4 md:px-5 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <div>.</div>
        <div className="flex gap-3 flex-shrink-0 [&>*]:cursor-pointer flex-end">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm sm:text-base whitespace-nowrap">
            <AiOutlineFolder className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Create Folder</span>
            <span className="sm:hidden">Folder</span>
          </button>
          <button 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-500 rounded-lg text-white font-medium hover:bg-orange-600 disabled:bg-orange-300 text-sm sm:text-base whitespace-nowrap"
          >
            <AiOutlineCloudUpload className="w-4 h-4 flex-shrink-0" />
            {isUploading ? 'Uploading...' : (
              <>
                <span className="hidden sm:inline">Upload File</span>
                <span className="sm:hidden">Upload</span>
              </>
            )}
          </button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Dynamic Breadcrumb */}
      {/* <Breadcrumbs projectId={projectId} tab="Documents" /> */}


            <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} className="mb-6"/>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Files and Folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Mobile: Only 2 filters side by side */}
        <div className="flex gap-3 lg:hidden">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 min-w-0">
            <span className="truncate">All Types</span>
            <IoChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 min-w-0">
            <span className="truncate">All Uploaders</span>
            <IoChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
        
        {/* Desktop: All 3 filters */}
        <div className="hidden lg:flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap">
            All Types
            <IoChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap">
            All Uploaders
            <IoChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap">
            Sort by Date
            <IoChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Uploading file...</span>
          </div>
        </div>
      )}

      {/* Responsive Document List */}
      <div className="bg-white rounded-lg shadow overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden lg:block w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Uploader
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
                        {doc.size && <div className="text-xs text-gray-500">{doc.size}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {doc.version ? (
                      <span className="text-sm text-blue-600 font-medium">{doc.version}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{doc.uploader}</div>
                      <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(doc.status, doc.statusColor)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <BsThreeDotsVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet Card View (md) */}
        <div className="hidden md:block lg:hidden p-4 space-y-4 w-full">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(doc.type)}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">{doc.name}</div>
                    {doc.size && <div className="text-xs text-gray-500 mt-0.5">{doc.size}</div>}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                  <BsThreeDotsVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Version</div>
                  <div className="font-medium text-gray-900">
                    {doc.version || <span className="text-gray-400">-</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Date</div>
                  <div className="text-gray-900">{doc.date}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Uploader</div>
                  <div className="font-medium text-gray-900 truncate">{doc.uploader}</div>
                  <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  <BsThreeDotsVertical className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Version</div>
                  <div className="font-medium text-gray-900">
                    {doc.version || <span className="text-gray-400">-</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Date</div>
                  <div className="text-gray-900">{doc.date}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Uploader</div>
                  <div className="font-medium text-gray-900 truncate">{doc.uploader}</div>
                  <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Status</div>
                  {getStatusBadge(doc.status, doc.statusColor)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Card View (sm and below) */}
        <div className="md:hidden space-y-4 p-4 w-full">
          {filteredDocuments.map((doc) => (
            <div key={doc.name + doc.date} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 break-words">{doc.name}</div>
                      {doc.size && <div className="text-xs text-gray-500 mt-0.5">{doc.size}</div>}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
                      <BsThreeDotsVertical className="w-5 h-5" />
                    </button>
                  </div>
                  {doc.version && (
                    <div className="mb-3">
                      <span className="text-sm text-blue-600 font-semibold">{doc.version}</span>
                    </div>
                  )}
                  <div className="space-y-2.5 text-sm mt-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Uploader:</div>
                      <div className="font-semibold text-gray-900 truncate">{doc.uploader}</div>
                      <div className="text-xs text-gray-500 truncate">{doc.uploaderRole}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Date:</div>
                      <div className="text-sm text-gray-900">{doc.date}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Status:</div>
                      {getStatusBadge(doc.status, doc.statusColor)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-gray-400 text-sm">
              {searchQuery ? 'No documents match your search' : 'No documents uploaded yet'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}