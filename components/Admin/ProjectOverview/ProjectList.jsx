"use client"

import { useEffect, useState } from "react"
import { FiSearch, FiChevronDown, FiPlus, FiMoreVertical, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import AddNewProjectModal from "@/components/modals/AddNewProjectModal"
import { useProjects } from "@/contexts/ProjectContext"
import { getDoc } from "firebase/firestore"

const useProjectsFallback = () => {
  return {
    projects: [],
    loading: false,
    error: null
  };
};

export default function ProjectOverview() {
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [managerNames, setManagerNames] = useState({})
  const itemsPerPage = 6

  // Use projects from context with fallback
  let projectsContext;
  try {
    projectsContext = useProjects();
  } catch (error) {
    console.warn("ProjectContext not available, using fallback:", error);
    projectsContext = useProjectsFallback();
  }

  const { projects, loading, error } = projectsContext;

  // Calculate pagination values
  const totalItems = projects.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)
  const startItem = startIndex + 1
  const endItem = Math.min(endIndex, totalItems)

  useEffect(() => {
    // Fetch display names for projectManager references
    const fetchManagerNames = async () => {
      const names = {}
      for (const project of currentProjects) {
        let manager = project.projectManager
        if (manager && typeof manager === 'object' && manager.path) {
          try {
            const snap = await getDoc(manager)
            if (snap.exists()) {
              names[project.id] = snap.data().displayName || snap.data().email || 'Unknown'
            } else {
              names[project.id] = 'Unknown'
            }
          } catch {
            names[project.id] = 'Unknown'
          }
        } else {
          names[project.id] = manager || 'Unknown'
        }
      }
      setManagerNames(names)
    }
    fetchManagerNames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProjects])

  const getStatusColor = (status) => {
    switch (status) {
      case "inProgress":
        return "bg-emerald-100 text-emerald-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-gray-200 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      case "onHold":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatStatus = (status) => {
    switch (status) {
      case "pending":
        return "Pending Kickoff"
      case "inProgress":
        return "In Progress"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      case "onHold":
        return "On Hold"
      default:
        return status
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatBudget = (budget) => {
    if (!budget) return "Not set"
    // Format as Nigerian Naira with commas
    return `₦${parseInt(budget).toLocaleString()}`
  }

  const formatPlan = (plan) => {
    switch (plan) {
      case "standard":
        return "Standard"
      case "premium":
        return "Premium"
      default:
        return plan
    }
  }

  // Get progress value - default to 0 if not present
  const getProgress = (project) => {
    return project.progress || 0;
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium ${
            currentPage === i
              ? "bg-orange-500 text-white"
              : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      )
    }
    
    return pages
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto max-w-8xl">
        {/* Header Section */}
        <div className="mb-4 lg:mb-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, address, or manager"
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Filter Buttons - Grid on mobile, flex on desktop */}
            <div className="grid grid-cols-2 gap-2 lg:flex lg:gap-2">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:px-4">
                All Statuses <FiChevronDown />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:px-4">
                All Managers <FiChevronDown />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:px-4">
                All Plans <FiChevronDown />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:px-4">
                All Dates <FiChevronDown />
              </button>
            </div>

            {/* Add New Project Button */}
            <button 
              onClick={openModal}
              className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 lg:w-auto lg:py-2"
            >
              <FiPlus /> Add New Project
            </button>
          </div>
        </div>

        {/* Projects Display - Table on desktop, Cards on mobile */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Project Address</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Project Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Est. Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProjects.map((project) => {
                  const progress = getProgress(project);
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.projectName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{project.projectAddress}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{managerNames[project.id] || 'Loading...'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.projectStatus)}`}
                        >
                          {formatStatus(project.projectStatus)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div 
                              className="h-full rounded-full bg-orange-500 transition-all duration-300" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                          <span className="text-sm text-gray-600 min-w-[40px]">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatBudget(project.initialBudget)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(project.startDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(project.completionDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatPlan(project.consultationPlan)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 p-4 lg:hidden">
            {currentProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects found
              </div>
            ) : (
              currentProjects.map((project) => {
                const progress = getProgress(project);
                return (
                  <div key={project.id} className="rounded-lg bg-white p-4 shadow">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{project.projectName}</h3>
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.projectStatus)}`}
                        >
                          {formatStatus(project.projectStatus)}
                        </span>
                      </div>
                      <button className="text-gray-400">
                        <FiMoreVertical size={20} />
                      </button>
                    </div>

                    <div className="mb-3 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Address:</span>
                        <span className="text-gray-900">{project.projectAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Manager:</span>
                        <span className="text-gray-900">{managerNames[project.id] || 'Loading...'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Budget:</span>
                        <span className="text-gray-900">
                          {formatBudget(project.initialBudget)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress:</span>
                        <span className="font-medium text-gray-900">{progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-orange-500 transition-all duration-300" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>{formatDate(project.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Completion:</span>
                        <span>{formatDate(project.completionDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Plan:</span>
                        <span>{formatPlan(project.consultationPlan)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first project.</p>
              <button 
                onClick={openModal}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
              >
                <FiPlus /> Create Your First Project
              </button>
            </div>
          </div>
        )}

        {/* Pagination - Only show if there are projects */}
        {projects.length > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600">
              Showing {startItem}-{endItem} of {totalItems} projects
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>
              
              {renderPageNumbers()}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {/* Modal */}
        <AddNewProjectModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
        />
      </div>
    </div>
  )
}