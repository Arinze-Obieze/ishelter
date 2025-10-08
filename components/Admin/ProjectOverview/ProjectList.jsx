"use client"

import Link from "next/link"
import { useState } from "react"
import { FiSearch, FiChevronDown, FiPlus, FiMoreVertical, FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function ProjectOverview() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const projects = [
    {
      name: "Riverside Apartments",
      client: "Acme Properties",
      manager: "Alice Smith",
      status: "In Progress",
      progress: 75,
      startDate: "Jan 15, 2023",
      estCompletion: "Apr 30, 2023",
      lastUpdate: "Mar 22, 2023",
    },
    {
      name: "Summit Heights",
      client: "TechSolutions",
      manager: "Bob Johnson",
      status: "On Hold",
      progress: 45,
      startDate: "Dec 10, 2022",
      estCompletion: "May 15, 2023",
      lastUpdate: "Feb 28, 2023",
    },
    {
      name: "Lakeside Condos",
      client: "Global Industries",
      manager: "Carol Williams",
      status: "Completed",
      progress: 100,
      startDate: "Nov 5, 2022",
      estCompletion: "Feb 20, 2023",
      lastUpdate: "Feb 18, 2023",
    },
    {
      name: "Downtown Lofts",
      client: "City Developers",
      manager: "David Brown",
      status: "In Progress",
      progress: 35,
      startDate: "Feb 8, 2023",
      estCompletion: "Jun 15, 2023",
      lastUpdate: "Mar 25, 2023",
    },
    {
      name: "Garden Estates",
      client: "Green Living Co",
      manager: "Emma Davis",
      status: "Cancelled",
      progress: 15,
      startDate: "Jan 20, 2023",
      estCompletion: "May 10, 2023",
      lastUpdate: "Feb 3, 2023",
    },
    {
      name: "Harbor View",
      client: "Coastal Homes",
      manager: "Frank Miller",
      status: "In Progress",
      progress: 60,
      startDate: "Dec 15, 2022",
      estCompletion: "Apr 30, 2023",
      lastUpdate: "Mar 18, 2023",
    },
    {
      name: "Skyline Towers",
      client: "Urban Concepts",
      manager: "Grace Wilson",
      status: "On Hold",
      progress: 25,
      startDate: "Mar 1, 2023",
      estCompletion: "Jul 15, 2023",
      lastUpdate: "Mar 20, 2023",
    },
    {
      name: "Metro Plaza",
      client: "Metro Developers",
      manager: "Henry Taylor",
      status: "In Progress",
      progress: 80,
      startDate: "Feb 1, 2023",
      estCompletion: "May 30, 2023",
      lastUpdate: "Mar 28, 2023",
    },
    {
      name: "Ocean View",
      client: "Seaside Corp",
      manager: "Ivy Anderson",
      status: "Completed",
      progress: 100,
      startDate: "Oct 10, 2022",
      estCompletion: "Mar 15, 2023",
      lastUpdate: "Mar 10, 2023",
    },
    {
      name: "Mountain Retreat",
      client: "Nature Homes",
      manager: "Jack Roberts",
      status: "In Progress",
      progress: 50,
      startDate: "Jan 5, 2023",
      estCompletion: "Jun 20, 2023",
      lastUpdate: "Mar 24, 2023",
    },
    {
      name: "City Center",
      client: "Urban Developers",
      manager: "Karen Lee",
      status: "On Hold",
      progress: 30,
      startDate: "Mar 5, 2023",
      estCompletion: "Aug 15, 2023",
      lastUpdate: "Mar 22, 2023",
    },
    {
      name: "Parkside Residences",
      client: "Green Space Inc",
      manager: "Leo Martinez",
      status: "In Progress",
      progress: 65,
      startDate: "Dec 20, 2022",
      estCompletion: "May 5, 2023",
      lastUpdate: "Mar 26, 2023",
    },
  ]

  // Calculate pagination values
  const totalItems = projects.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProjects = projects.slice(startIndex, endIndex)
  const startItem = startIndex + 1
  const endItem = Math.min(endIndex, totalItems)

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-emerald-100 text-emerald-700"
      case "On Hold":
        return "bg-blue-100 text-blue-700"
      case "Completed":
        return "bg-gray-200 text-gray-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
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
                placeholder="Search projects by name, client, or manager"
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
                All Clients <FiChevronDown />
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 lg:px-4">
                All Dates <FiChevronDown />
              </button>
            </div>

            {/* Add New Project Button */}
            <Link href="/admin/project-overview/add-new-project" className="lg:w-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 lg:w-auto lg:py-2">
                <FiPlus /> Add New Project
              </button>
            </Link>
          </div>
        </div>

        {/* Projects Display - Table on desktop, Cards on mobile */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Project Name ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Client ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Project Manager ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Progress ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Start Date ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Est. Completion ▲</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProjects.map((project, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.manager}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.startDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.estCompletion}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{project.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 p-4 lg:hidden">
            {currentProjects.map((project, index) => (
              <div key={index} className="rounded-lg bg-white p-4 shadow">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{project.name}</h3>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <button className="text-gray-400">
                    <FiMoreVertical size={20} />
                  </button>
                </div>

                <div className="mb-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Client:</span>
                    <span className="text-gray-900">{project.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Manager:</span>
                    <span className="text-gray-900">{project.manager}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress:</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span>{project.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Completion:</span>
                    <span>{project.estCompletion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination - Consistent for both mobile and desktop */}
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
      </div>
    </div>
  )
}