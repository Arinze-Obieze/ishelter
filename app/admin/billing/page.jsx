"use client"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 8000 },
  { month: "Feb", revenue: 9500 },
  { month: "Mar", revenue: 9200 },
  { month: "Apr", revenue: 10500 },
  { month: "May", revenue: 10800 },
  { month: "Jun", revenue: 11000 },
  { month: "Jul", revenue: 11500 },
  { month: "Aug", revenue: 12000 },
  { month: "Sep", revenue: 12500 },
  { month: "Oct", revenue: 12800 },
  { month: "Nov", revenue: 12800 },
  { month: "Dec", revenue: 12800 },
]

const invoiceStatusData = [
  { name: "Paid", value: 65, color: "#10b981" },
  { name: "Due", value: 25, color: "#f59e0b" },
  { name: "Overdue", value: 10, color: "#ef4444" },
]

const consultationData = [
  { name: "LandFit", value: 4500 },
  { name: "BuildPath", value: 5500 },
]

const invoiceTableData = [
  {
    id: "INV-2023-001",
    client: "Acme Properties",
    project: "Westside Complex",
    amount: "$4,500",
    issued: "12/01/2023",
    dueDate: "12/15/2023",
    status: "Paid",
  },
  {
    id: "INV-2023-002",
    client: "Mountain View LLC",
    project: "Hillside Residences",
    amount: "$5,800",
    issued: "12/05/2023",
    dueDate: "12/20/2023",
    status: "Due",
  },
  {
    id: "INV-2023-003",
    client: "BrightPath Developers",
    project: "Sunshine Apartments",
    amount: "$3,200",
    issued: "11/15/2023",
    dueDate: "11/30/2023",
    status: "Overdue",
  },
  {
    id: "INV-2023-004",
    client: "City Heights Inc.",
    project: "Downtown Lofts",
    amount: "$6,500",
    issued: "12/10/2023",
    dueDate: "12/25/2023",
    status: "Due",
  },
]

const paymentsData = [
  {
    date: "12/12/2023",
    client: "Jennifer Martin",
    plan: "LandFit",
    amount: "$300",
  },
  {
    date: "12/10/2023",
    client: "Robert Johnson",
    plan: "BuildPath",
    amount: "$500",
  },
  {
    date: "12/08/2023",
    client: "Sarah Williams",
    plan: "LandFit",
    amount: "$300",
  },
  {
    date: "12/05/2023",
    client: "Michael Brown",
    plan: "BuildPath",
    amount: "$500",
  },
  {
    date: "12/01/2023",
    client: "Amanda Davis",
    plan: "LandFit",
    amount: "$300",
  },
]

const StatCard = ({ label, value, change, isPositive }) => (
  <div className="bg-white rounded-lg p-4 md:p-6">
    <p className="text-gray-600 text-sm md:text-base font-medium">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{value}</p>
    <p className={`text-xs md:text-sm font-medium mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
      {isPositive ? "↑" : "↓"} {change}
    </p>
  </div>
)

const StatusBadge = ({ status }) => {
  const statusColors = {
    Paid: "bg-green-100 text-green-700",
    Due: "bg-amber-100 text-amber-700",
    Overdue: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${statusColors[status]}`}>
      {status}
    </span>
  )
}

export default function BillingDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Billing Reports & Financials</h1>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard label="Total Revenue (YTD)" value="$150,000" change="12% vs last year" isPositive={true} />
          <StatCard label="Outstanding Invoices" value="25" change="5 fewer than last month" isPositive={true} />
          <StatCard label="Revenue This Month" value="$15,000" change="8% vs last month" isPositive={true} />
          <StatCard label="Consultation Revenue (YTD)" value="$10,000" change="15% vs last year" isPositive={true} />
        </div>

        {/* Revenue Trends Chart */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
              />
              <Bar dataKey="revenue" fill="#f97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Invoice Status and Consultation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Invoice Status Summary */}
          <div className="bg-white rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Invoice Status Summary</h2>
            <div className="flex justify-center mb-6">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="space-y-2 text-sm md:text-base">
              {invoiceStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Sales Breakdown */}
          <div className="bg-white rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Consultation Sales Breakdown</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={consultationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `$${value}`}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Table Section */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Invoice Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Invoice #</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 hidden sm:table-cell">
                    Client
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 hidden md:table-cell">
                    Project
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 hidden lg:table-cell">
                    Issued
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 hidden lg:table-cell">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoiceTableData.map((invoice, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 md:px-4 text-gray-900 font-medium">{invoice.id}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-700 hidden sm:table-cell">{invoice.client}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-700 hidden md:table-cell">{invoice.project}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-900 font-semibold">{invoice.amount}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-700 hidden lg:table-cell">{invoice.issued}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-700 hidden lg:table-cell">{invoice.dueDate}</td>
                    <td className="py-3 px-2 md:px-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments Section */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Recent Consultation Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Client</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700 hidden sm:table-cell">Plan</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.map((payment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 md:px-4 text-gray-700">{payment.date}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-900 font-medium">{payment.client}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-700 hidden sm:table-cell">{payment.plan}</td>
                    <td className="py-3 px-2 md:px-4 text-gray-900 font-semibold">{payment.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button className="flex-1 bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            📋 View All Invoices
          </button>
          <button className="flex-1 bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            📊 Generate New Report
          </button>
        </div>
      </div>
    </main>
  )
}
