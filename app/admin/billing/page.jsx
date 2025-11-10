"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

const StatusBadge = ({ status }) => {
  const statusColors = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const StatCard = ({ label, value, change, isPositive }) => (
  <div className="bg-white rounded-lg p-4 md:p-6">
    <p className="text-gray-600 text-sm md:text-base font-medium">{label}</p>
    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">{value}</p>
    {change && (
      <p className={`text-xs md:text-sm font-medium mt-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} {change}
      </p>
    )}
  </div>
)

export default function AdminBillingDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenueYTD: 0,
    outstandingInvoices: 0,
    revenueThisMonth: 0,
    consultationRevenueYTD: 0
  })
  const [revenueData, setRevenueData] = useState([])
  const [invoiceStatusData, setInvoiceStatusData] = useState([])
  const [consultationData, setConsultationData] = useState([])
  const [invoiceTableData, setInvoiceTableData] = useState([])
  const [paymentsData, setPaymentsData] = useState([])

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      setLoading(true)

      // Fetch all invoices
      const invoicesSnapshot = await getDocs(collection(db, "invoices"))
      const invoices = []
      
      for (const docSnap of invoicesSnapshot.docs) {
        const invoiceData = { id: docSnap.id, ...docSnap.data() }
        
        // Resolve project reference
        if (invoiceData.projectRef) {
          const projectDoc = await getDoc(invoiceData.projectRef)
          invoiceData.projectName = projectDoc.exists() ? projectDoc.data().projectName : "Unknown Project"
          
          // Resolve client from project users
          if (projectDoc.exists()) {
            const projectData = projectDoc.data()
            if (projectData.projectUsers && projectData.projectUsers.length > 0) {
              const clientRef = projectData.projectUsers.find(async (userRef) => {
                const userDoc = await getDoc(userRef)
                return userDoc.exists() && userDoc.data().role === "client"
              })
              
              if (clientRef) {
                const clientDoc = await getDoc(clientRef)
                invoiceData.clientName = clientDoc.exists() ? clientDoc.data().fullName || clientDoc.data().email : "Unknown Client"
              } else {
                invoiceData.clientName = "No Client Assigned"
              }
            }
          }
        }
        
        invoices.push(invoiceData)
      }

      // Fetch all consultation registrations
      const consultationsSnapshot = await getDocs(collection(db, "consultation-registrations"))
      const consultations = consultationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Calculate stats
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()
      const currentDate = new Date()

      // Paid invoices
      const paidInvoices = invoices.filter(inv => inv.status === "paid")
      const paidInvoicesYTD = paidInvoices.filter(inv => {
        const paidDate = inv.paidAt?.toDate ? inv.paidAt.toDate() : (inv.createdAt?.toDate ? inv.createdAt.toDate() : new Date(inv.createdAt))
        return paidDate.getFullYear() === currentYear
      })
      const paidInvoicesThisMonth = paidInvoices.filter(inv => {
        const paidDate = inv.paidAt?.toDate ? inv.paidAt.toDate() : (inv.createdAt?.toDate ? inv.createdAt.toDate() : new Date(inv.createdAt))
        return paidDate.getFullYear() === currentYear && paidDate.getMonth() === currentMonth
      })

      // Paid consultations
      const paidConsultations = consultations.filter(c => c.status === "paid" || c.payment === "success")
      const paidConsultationsYTD = paidConsultations.filter(c => {
        const paidDate = c.paidAt?.toDate ? c.paidAt.toDate() : (c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt))
        return paidDate.getFullYear() === currentYear
      })
      const paidConsultationsThisMonth = paidConsultations.filter(c => {
        const paidDate = c.paidAt?.toDate ? c.paidAt.toDate() : (c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt))
        return paidDate.getFullYear() === currentYear && paidDate.getMonth() === currentMonth
      })

      // Calculate consultation amounts
      const getConsultationAmount = (consultation) => {
        if (consultation.plan === "BuildPath Consultation") return 498
        return 299 // LandFit Consultation
      }

      // Total revenue calculations
      const invoiceRevenueYTD = paidInvoicesYTD.reduce((sum, inv) => sum + Number(inv.amount), 0)
      const consultationRevenueYTD = paidConsultationsYTD.reduce((sum, c) => sum + getConsultationAmount(c), 0)
      const totalRevenueYTD = invoiceRevenueYTD + consultationRevenueYTD

      const invoiceRevenueThisMonth = paidInvoicesThisMonth.reduce((sum, inv) => sum + Number(inv.amount), 0)
      const consultationRevenueThisMonth = paidConsultationsThisMonth.reduce((sum, c) => sum + getConsultationAmount(c), 0)
      const revenueThisMonth = invoiceRevenueThisMonth + consultationRevenueThisMonth

      // Outstanding invoices
      const outstandingInvoices = invoices.filter(inv => inv.status === "pending" || inv.status === "overdue").length

      setStats({
        totalRevenueYTD,
        outstandingInvoices,
        revenueThisMonth,
        consultationRevenueYTD
      })

      // Revenue trends (last 12 months)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const trendsMap = {}
      
      // Initialize last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const key = `${date.getFullYear()}-${date.getMonth()}`
        trendsMap[key] = {
          month: monthNames[date.getMonth()],
          revenue: 0
        }
      }

      // Add invoice revenue
      paidInvoices.forEach(inv => {
        const paidDate = inv.paidAt?.toDate ? inv.paidAt.toDate() : (inv.createdAt?.toDate ? inv.createdAt.toDate() : new Date(inv.createdAt))
        const key = `${paidDate.getFullYear()}-${paidDate.getMonth()}`
        if (trendsMap[key]) {
          trendsMap[key].revenue += Number(inv.amount)
        }
      })

      // Add consultation revenue
      paidConsultations.forEach(c => {
        const paidDate = c.paidAt?.toDate ? c.paidAt.toDate() : (c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt))
        const key = `${paidDate.getFullYear()}-${paidDate.getMonth()}`
        if (trendsMap[key]) {
          trendsMap[key].revenue += getConsultationAmount(c)
        }
      })

      setRevenueData(Object.values(trendsMap))

      // Invoice status breakdown
      const totalInvoices = invoices.length
      const paidCount = invoices.filter(inv => inv.status === "paid").length
      const pendingCount = invoices.filter(inv => inv.status === "pending").length
      const overdueCount = invoices.filter(inv => inv.status === "overdue").length

      setInvoiceStatusData([
        { name: "Paid", value: totalInvoices > 0 ? Math.round((paidCount / totalInvoices) * 100) : 0, color: "#10b981" },
        { name: "Pending", value: totalInvoices > 0 ? Math.round((pendingCount / totalInvoices) * 100) : 0, color: "#f59e0b" },
        { name: "Overdue", value: totalInvoices > 0 ? Math.round((overdueCount / totalInvoices) * 100) : 0, color: "#ef4444" },
      ])

      // Consultation breakdown
      const landFitConsultations = paidConsultationsYTD.filter(c => c.plan === "LandFit Consultation")
      const buildPathConsultations = paidConsultationsYTD.filter(c => c.plan === "BuildPath Consultation")

      setConsultationData([
        { name: "LandFit", value: landFitConsultations.length * 299 },
        { name: "BuildPath", value: buildPathConsultations.length * 498 },
      ])

      // Invoice table data (limit to recent 10)
      const recentInvoices = invoices
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return dateB - dateA
        })
        .slice(0, 10)
        .map(inv => ({
          id: inv.invoiceNumber || inv.id,
          client: inv.clientName || "Unknown",
          project: inv.projectName || "Unknown",
          amount: `$${Number(inv.amount).toLocaleString()}`,
          issued: inv.createdAt?.toDate ? inv.createdAt.toDate().toLocaleDateString() : "N/A",
          dueDate: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A",
          status: inv.status,
        }))

      setInvoiceTableData(recentInvoices)

      // Recent consultation payments (limit to 5)
      const recentConsultations = paidConsultations
        .sort((a, b) => {
          const dateA = a.paidAt?.toDate ? a.paidAt.toDate() : (a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt))
          const dateB = b.paidAt?.toDate ? b.paidAt.toDate() : (b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt))
          return dateB - dateA
        })
        .slice(0, 5)
        .map(c => ({
          date: c.paidAt?.toDate ? c.paidAt.toDate().toLocaleDateString() : (c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : "N/A"),
          client: c.fullName || "Unknown",
          plan: c.plan?.replace(" Consultation", "") || "LandFit",
          amount: `$${getConsultationAmount(c)}`,
        }))

      setPaymentsData(recentConsultations)

    } catch (error) {
      console.error("Error fetching billing data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading billing data...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Billing Reports & Financials</h1>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard 
            label="Total Revenue (YTD)" 
            value={`$${stats.totalRevenueYTD.toLocaleString()}`} 
            change={null}
            isPositive={true} 
          />
          <StatCard 
            label="Outstanding Invoices" 
            value={stats.outstandingInvoices} 
            change={null}
            isPositive={false} 
          />
          <StatCard 
            label="Revenue This Month" 
            value={`$${stats.revenueThisMonth.toLocaleString()}`} 
            change={null}
            isPositive={true} 
          />
          <StatCard 
            label="Consultation Revenue (YTD)" 
            value={`$${stats.consultationRevenueYTD.toLocaleString()}`} 
            change={null}
            isPositive={true} 
          />
        </div>

        {/* Revenue Trends Chart */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Revenue Trends (Last 12 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `$${value.toLocaleString()}`}
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
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Consultation Sales Breakdown (YTD)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={consultationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Table Section */}
        <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Recent Invoices</h2>
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
        {/* <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8">
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
        </div> */}

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button className="flex-1 bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            📋 Export Report (CSV)
          </button>
          <button className="flex-1 bg-white text-gray-900 border border-gray-300 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            📊 Generate Custom Report
          </button>
        </div> */}
      </div>
    </main>
  )
}