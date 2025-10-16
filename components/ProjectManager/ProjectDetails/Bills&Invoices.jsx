import { FaPlus, FaSearch, FaEllipsisV, FaCheckCircle } from "react-icons/fa"
import TabsNavigation from "./TabsNavigation"

export default function BillingTab({ projectId, tabs, activeTab, onTabChange }) {
  // Data configuration
  const budgetData = {
    total: 77000000,
    spent: 31500000,
    remaining: 45500000,
    percentageUsed: 0.41,
    status: "Healthy",
    statusColor: "bg-green-50 border-green-300 text-green-700",
    variance: {
      amount: 2100000,
      type: "under", // "under" or "over"
      message: "+NGN 2,100,000 Under Budget"
    }
  }

  const invoicesData = [
    {
      id: "INV-2024-001",
      amount: 12500000,
      dateIssued: "2024-01-15",
      dueDate: "2024-02-15",
      status: "paid",
    },
    {
      id: "INV-2024-002",
      amount: 8750000,
      dateIssued: "2024-02-20",
      dueDate: "2024-03-20",
      status: "paid",
    },
    {
      id: "INV-2024-003",
      amount: 10250000,
      dateIssued: "2024-03-25",
      dueDate: "2024-04-25",
      status: "pending",
    },
    {
      id: "INV-2024-004",
      amount: 6800000,
      dateIssued: "2024-04-10",
      dueDate: "2024-05-10",
      status: "overdue",
    },
  ]

  const expensesData = [
    { name: "Material Transportation - March", amount: 450000 },
    { name: "Equipment Rental - April", amount: 320000 },
    { name: "Site Utilities - Q1", amount: 180000 },
  ]

  // Helper functions
  const formatCurrency = (amount) => {
    return `NGN ${amount.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusConfig = (status) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-700", label: "Paid" },
      pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
      overdue: { color: "bg-red-100 text-red-700", label: "Overdue" }
    }
    return statusConfig[status] || statusConfig.pending
  }

  const calculateStrokeDasharray = (percentage) => {
    const circumference = 2 * Math.PI * 56
    return `${circumference * percentage} ${circumference}`
  }

  // Processed data
  const processedInvoices = invoicesData.map(invoice => {
    const statusConfig = getStatusConfig(invoice.status)
    return {
      ...invoice,
      formattedAmount: formatCurrency(invoice.amount),
      formattedDateIssued: formatDate(invoice.dateIssued),
      formattedDueDate: formatDate(invoice.dueDate),
      statusColor: statusConfig.color,
      statusLabel: statusConfig.label,
      isOverdue: invoice.status === 'overdue'
    }
  })

  const processedExpenses = expensesData.map(expense => ({
    ...expense,
    formattedAmount: formatCurrency(expense.amount)
  }))

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="">
        <div className="px-4 py-6 md:px-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Lagos Housing Project - Phase 2</h1>
        </div>
      </div>

      <div className="mb-6 mt-8 bg-white">
        <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto bg-gray-50">
        {/* Budget Overview Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Budget Overview</h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg w-fit ${budgetData.statusColor}`}>
              <FaCheckCircle className="text-green-600" />
              <span className="text-sm font-medium">{budgetData.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-6">
            {/* Budget Items */}
            {[
              { label: "Total Project Budget", amount: budgetData.total, color: "text-gray-900" },
              { label: "Amount Spent/Billed", amount: budgetData.spent, color: "text-orange-500" },
              { label: "Remaining Budget", amount: budgetData.remaining, color: "text-green-600" }
            ].map((item, index) => (
              <div key={index}>
                <p className="text-sm text-gray-500 mb-2">{item.label}</p>
                <p className={`text-base md:text-2xl font-bold ${item.color}`}>
                  {formatCurrency(item.amount)}
                </p>
              </div>
            ))}

            {/* Progress Chart - Desktop */}
            <div className="hidden md:flex md:items-center md:justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#f97316"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={calculateStrokeDasharray(budgetData.percentageUsed)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round(budgetData.percentageUsed * 100)}%
                  </span>
                  <span className="text-sm text-gray-500">Used</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Chart - Mobile */}
          <div className="flex justify-center md:hidden mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#f97316"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={calculateStrokeDasharray(budgetData.percentageUsed)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {Math.round(budgetData.percentageUsed * 100)}%
                </span>
                <span className="text-sm text-gray-500">Used</span>
              </div>
            </div>
          </div>
        </div>

      

        {/* Project Invoices Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Project Invoices</h2>
            <button className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              <FaPlus />
              <span>Create New Invoice</span>
            </button>
          </div>

          {/* Mobile: Search and Filters */}
          <div className="md:hidden space-y-3 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Invoices.."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>All Statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>All Time</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>

          {/* Mobile: Invoice List */}
          <div className="md:hidden space-y-4">
            {processedInvoices.map((invoice) => (
              <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.id}</p>
                    <p className="text-lg font-bold text-orange-500 mt-1">{invoice.formattedAmount}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisV />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">{invoice.formattedDateIssued}</span>
                  <span className={invoice.isOverdue ? "text-red-600 font-medium" : "text-gray-900"}>
                    {invoice.formattedDueDate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                    {invoice.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Invoice Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount (NGN)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date Issued</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">{invoice.id}</td>
                    <td className="py-4 px-4 text-sm font-bold text-orange-500">{invoice.formattedAmount}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{invoice.formattedDateIssued}</td>
                    <td className={`py-4 px-4 text-sm ${invoice.isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                      {invoice.formattedDueDate}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                        {invoice.statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaEllipsisV />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}