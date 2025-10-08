"use client"

import { useState } from "react"
import { FiSearch, FiChevronDown, FiPlus, FiMoreVertical, FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function ProjectOverview() {
  const [currentPage, setCurrentPage] = useState(1)

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
  ]

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto max-w-8xl">
        {/* Header Section - Desktop */}
        <div className="mb-6 hidden lg:flex lg:items-center lg:gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name, client, or manager"
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            All Statuses <FiChevronDown />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            All Managers <FiChevronDown />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            All Clients <FiChevronDown />
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            All Dates <FiChevronDown />
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
            <FiPlus /> Add New Project
          </button>
        </div>

        {/* Header Section - Mobile */}
        <div className="mb-4 lg:hidden">
          <div className="relative mb-3">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects by name, client, or m..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              All Statuses <FiChevronDown />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              All Managers <FiChevronDown />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              All Clients <FiChevronDown />
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700">
              All Dates <FiChevronDown />
            </button>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white">
            <FiPlus /> Add New Project
          </button>
        </div>

        {/* Desktop Table View */}
        <div className="hidden overflow-hidden rounded-lg bg-white shadow lg:block">
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
              {projects.map((project, index) => (
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
        <div className="space-y-4 lg:hidden">
          {projects.slice(0, 6).map((project, index) => (
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

        {/* Pagination - Mobile Only */}
        <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
          <p className="text-sm text-gray-600">Showing 1-6 of 75 projects</p>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 lg:hidden">
          <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
            <FiChevronLeft />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-sm font-medium text-white">
            1
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50">
            2
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm text-gray-600 hover:bg-gray-50">
            3
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}
