import { FiSearch, FiPlus, FiMoreVertical, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi"

export default function ConsultationLeadList() {
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
  ]

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search lead by name, email or SM"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium">
              <FiPlus className="w-4 h-4" />
              Add New Lead
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Status: All</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Assigned SM: All</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Plan: All</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option>Date: All time</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned SM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(lead.status)}>{lead.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.assignedSM ? (
                      lead.assignedSM
                    ) : (
                      <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-md text-xs font-medium">
                        Assign SM
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.submissionDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-orange-500 text-white rounded-md text-sm font-medium">1</button>
              <button className="px-3 py-1 text-gray-500 hover:text-gray-700 rounded-md text-sm font-medium">2</button>
              <button className="px-3 py-1 text-gray-500 hover:text-gray-700 rounded-md text-sm font-medium">3</button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
