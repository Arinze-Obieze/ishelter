'use client'
import { useState, useEffect } from "react"
import { FiSearch, FiPlus, FiMoreVertical, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function ConsultationLeadList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [assignedSMFilter, setAssignedSMFilter] = useState("ALL")
  const [planFilter, setPlanFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("ALL")

  const leads = [
    {
      id: 1,
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "(555) 123-4567",
      plan: "LandFit Consultation",
      status: "NEW",
      assignedSM: null,
      submissionDate: "Jul 12, 2023",
    },
    {
      id: 2,
      name: "Emily Johnson",
      email: "emily.j@example.com",
      phone: "(555) 234-5678",
      plan: "BuildPath Consultation",
      status: "ASSIGNED",
      assignedSM: "Sarah Parker",
      submissionDate: "Jul 10, 2023",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "mbrown@example.com",
      phone: "(555) 345-6789",
      plan: "LandFit Consultation",
      status: "SCHEDULED",
      assignedSM: "John Smith",
      submissionDate: "Jul 8, 2023",
    },
    {
      id: 4,
      name: "Jessica Lee",
      email: "jlee@example.com",
      phone: "(555) 456-7890",
      plan: "BuildPath Consultation",
      status: "COMPLETED",
      assignedSM: "Mike Johnson",
      submissionDate: "Jul 5, 2023",
    },
    {
      id: 5,
      name: "Robert Davis",
      email: "rdavis@example.com",
      phone: "(555) 567-8901",
      plan: "LandFit Consultation",
      status: "CANCELLED",
      assignedSM: "Sarah Parker",
      submissionDate: "Jul 3, 2023",
    },
    {
      id: 6,
      name: "Amanda Wilson",
      email: "awilson@example.com",
      phone: "(555) 678-9012",
      plan: "BuildPath Consultation",
      status: "NEW",
      assignedSM: null,
      submissionDate: "Jul 12, 2023",
    },
    {
      id: 7,
      name: "Thomas Clark",
      email: "tclark@example.com",
      phone: "(555) 789-0123",
      plan: "LandFit Consultation",
      status: "ASSIGNED",
      assignedSM: "John Smith",
      submissionDate: "Jul 11, 2023",
    },
    {
      id: 8,
      name: "Sarah Martinez",
      email: "smartinez@example.com",
      phone: "(555) 890-1234",
      plan: "BuildPath Consultation",
      status: "SCHEDULED",
      assignedSM: "Mike Johnson",
      submissionDate: "Jul 9, 2023",
    },
    // Add more sample data to test pagination
    ...Array.from({ length: 15 }, (_, i) => ({
      id: i + 9,
      name: `Sample Lead ${i + 9}`,
      email: `lead${i + 9}@example.com`,
      phone: `(555) ${100 + i}-${1000 + i}`,
      plan: i % 2 === 0 ? "LandFit Consultation" : "BuildPath Consultation",
      status: ["NEW", "ASSIGNED", "SCHEDULED", "COMPLETED", "CANCELLED"][i % 5],
      assignedSM: i % 3 === 0 ? null : ["Sarah Parker", "John Smith", "Mike Johnson"][i % 3],
      submissionDate: `Jul ${15 - (i % 15)}, 2023`,
    }))
  ]

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium"

    switch (status) {
      case "NEW":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "ASSIGNED":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "SCHEDULED":
        return `${baseClasses} bg-green-100 text-green-800`
      case "COMPLETED":
        return `${baseClasses} bg-purple-100 text-purple-800`
      case "CANCELLED":
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.assignedSM && lead.assignedSM.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter
    const matchesAssignedSM = assignedSMFilter === "ALL" || 
      (assignedSMFilter === "UNASSIGNED" ? !lead.assignedSM : lead.assignedSM === assignedSMFilter)
    const matchesPlan = planFilter === "ALL" || lead.plan === planFilter
    const matchesDate = dateFilter === "ALL" // Simplified date filter

    return matchesSearch && matchesStatus && matchesAssignedSM && matchesPlan && matchesDate
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem)

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  // Responsive column configuration
  const getVisibleColumns = () => {
    if (windowWidth < 640) {
      return ['name', 'status', 'actions'] // Mobile: Only essential columns
    } else if (windowWidth < 768) {
      return ['name', 'email', 'status', 'actions'] // Small tablets
    } else if (windowWidth < 1024) {
      return ['name', 'email', 'plan', 'status', 'actions'] // Tablets
    } else {
      return ['name', 'email', 'phone', 'plan', 'status', 'assignedSM', 'submissionDate', 'actions'] // Desktop: All columns
    }
  }

  const visibleColumns = getVisibleColumns()

  const columnHeaders = {
    name: "Lead Name",
    email: "Email Address",
    phone: "Phone Number",
    plan: "Requested Plan",
    status: "Status",
    assignedSM: "Assigned SM",
    submissionDate: "Submission Date",
    actions: "Actions"
  }

  const renderLeadData = (lead, column) => {
    switch (column) {
      case 'name':
        return <span className="font-medium text-gray-900">{lead.name}</span>
      case 'email':
        return <span className="text-gray-600">{lead.email}</span>
      case 'phone':
        return <span className="text-gray-600">{lead.phone}</span>
      case 'plan':
        return <span className="text-gray-600">{lead.plan}</span>
      case 'status':
        return <span className={getStatusBadge(lead.status)}>{lead.status}</span>
      case 'assignedSM':
        return lead.assignedSM ? (
          <span className="text-gray-600">{lead.assignedSM}</span>
        ) : (
          <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-md text-xs font-medium transition-colors">
            Assign SM
          </button>
        )
      case 'submissionDate':
        return <span className="text-gray-600">{lead.submissionDate}</span>
      case 'actions':
        return (
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
            <FiMoreVertical className="w-4 h-4" />
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lead by name, email or SM"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors w-full sm:w-auto justify-center">
              <FiPlus className="w-4 h-4" />
              Add New Lead
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="relative min-w-[120px] flex-1 sm:flex-none">
              <select 
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ALL">Status: All</option>
                <option value="NEW">New</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative min-w-[120px] flex-1 sm:flex-none">
              <select 
                value={assignedSMFilter}
                onChange={(e) => {
                  setAssignedSMFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ALL">Assigned SM: All</option>
                <option value="UNASSIGNED">Unassigned</option>
                <option value="Sarah Parker">Sarah Parker</option>
                <option value="John Smith">John Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative min-w-[120px] flex-1 sm:flex-none">
              <select 
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ALL">Plan: All</option>
                <option value="LandFit Consultation">LandFit</option>
                <option value="BuildPath Consultation">BuildPath</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative min-w-[120px] flex-1 sm:flex-none">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="ALL">Date: All time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map(column => (
                  <th key={column} className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {columnHeaders[column]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentLeads.length > 0 ? (
                currentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    {visibleColumns.map(column => (
                      <td key={column} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {renderLeadData(lead, column)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={visibleColumns.length} className="px-6 py-8 text-center text-gray-500">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredLeads.length)}
                </span>{" "}
                of <span className="font-medium">{filteredLeads.length}</span> results
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-gray-100"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-orange-500 text-white'
                        : page === '...'
                        ? 'text-gray-400 cursor-default'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-gray-100"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}