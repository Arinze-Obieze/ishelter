import { FiMoreVertical } from "react-icons/fi"
import ActionDropdown from './ActionDropdown'

export default function LeadTable({ leads, windowWidth, filteredLeadsCount }) {
  const visibleColumns = getVisibleColumns(windowWidth)
  const columnHeaders = {
    name: "Lead Name",
    email: "Email Address",
    phone: "Phone Number",
    plan: "Requested Plan",
    payment: "Status",
    assignedSM: "Assigned SM",
    submissionDate: "Submission Date",
    actions: "Actions"
  }

  const getStatusBadge = (payment) => {
    const baseClasses = "px-2 py-1 rounded-md text-xs font-medium"
    switch (payment) {
      case "success": return `${baseClasses} bg-green-100 text-green-800`
      case "pending": return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "NEW": return `${baseClasses} bg-blue-100 text-blue-800`
      case "ASSIGNED": return `${baseClasses} bg-purple-100 text-purple-800`
      case "COMPLETED": return `${baseClasses} bg-green-100 text-green-800`
      case "CANCELLED": return `${baseClasses} bg-red-100 text-red-800`
      default: return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const renderLeadData = (lead, column) => {
    switch (column) {
      case 'name': return <span className="font-medium text-gray-900">{lead.name}</span>
      case 'email': return <span className="text-gray-600">{lead.email}</span>
      case 'phone': return <span className="text-gray-600">{lead.phone}</span>
      case 'plan': return <span className="text-gray-600">{lead.plan}</span>
      case 'payment': return <span className={getStatusBadge(lead.payment)}>{lead.payment}</span>
      case 'assignedSM':
        return lead.assignedSM ? (
          <span className="text-gray-600">{lead.assignedSM}</span>
        ) : (
          <button className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded-md text-xs font-medium transition-colors">
            Assign SM
          </button>
        )
      case 'submissionDate': return <span className="text-gray-600">{lead.submissionDate}</span>
      case 'actions':
        return <ActionDropdown lead={lead} />
      default: return null
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.map(column => (
              <th key={column} className="px-2 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {columnHeaders[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                {visibleColumns.map(column => (
                  <td key={column} className="px-2 sm:px-6 py-4  text-sm">
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
  )
}

function getVisibleColumns(windowWidth) {
  if (windowWidth < 640) {
    return ['name', 'payment', 'actions']
  } else if (windowWidth < 768) {
    return ['name', 'email', 'payment', 'actions']
  } else if (windowWidth < 1024) {
    return ['name', 'email', 'plan', 'payment', 'actions']
  } else {
    return ['name', 'email', 'phone', 'plan', 'payment', 'assignedSM', 'submissionDate', 'actions']
  }
}