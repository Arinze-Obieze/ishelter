'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IoMdDocument } from "react-icons/io"
import { IoWarning } from "react-icons/io5"
import { MdAttachMoney, MdCalendarToday, MdCheckCircle, MdFilterList, MdHistory, MdLocationOn, MdWarning } from "react-icons/md"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function BillingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all projects")
  const { projects: userProjects, loading: projectsLoading } = usePersonalProjects()
  
  const [enrichedProjects, setEnrichedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalOutstanding, setTotalOutstanding] = useState(0)
  const [nextPaymentDue, setNextPaymentDue] = useState(null)
  const [projectsWithOverdue, setProjectsWithOverdue] = useState(0)

  useEffect(() => {
    if (projectsLoading) return

    const enrichProjectsWithBilling = async () => {
      setLoading(true)
      
      try {
        let allOverdueAmount = 0
        let earliestDueDate = null
        let overdueProjectCount = 0

        const enrichedData = await Promise.all(
          userProjects.map(async (project) => {
            try {
              const projectRef = doc(db, "projects", project.id)
              const projectSnap = await getDoc(projectRef)
              
              if (!projectSnap.exists()) {
                return createEmptyProjectBilling(project)
              }

              const projectData = projectSnap.data()
              const invoiceRefs = projectData.projectInvoices || []
              
              const invoices = []
              for (const invoiceRef of invoiceRefs) {
                try {
                  const invoiceSnap = await getDoc(invoiceRef)
                  if (invoiceSnap.exists()) {
                    invoices.push({ id: invoiceSnap.id, ...invoiceSnap.data() })
                  }
                } catch (err) {
                  console.error("Error fetching invoice:", err)
                }
              }

              const billingData = calculateProjectBilling(invoices)
              
              if (billingData.hasOverdue) {
                allOverdueAmount += billingData.overdueAmount
                overdueProjectCount++
              }

              if (billingData.nextDueDate) {
                const dueDate = new Date(billingData.nextDueDate)
                if (!earliestDueDate || dueDate < earliestDueDate) {
                  earliestDueDate = dueDate
                }
              }

              return {
                id: project.id,
                name: project.projectName || "Untitled Project",
                location: project.projectAddress || "Location not set",
                status: billingData.status,
                statusText: billingData.statusText,
                paymentDue: billingData.totalUnpaid,
                dueDate: billingData.nextDueDate,
                lastPayment: billingData.lastPaymentDate,
                hasInvoices: invoices.length > 0,
                hasUnpaid: billingData.hasUnpaid
              }
            } catch (err) {
              console.error(`Error enriching project ${project.id}:`, err)
              return createEmptyProjectBilling(project)
            }
          })
        )

        setEnrichedProjects(enrichedData)
        setTotalOutstanding(allOverdueAmount)
        setNextPaymentDue(earliestDueDate ? formatDate(earliestDueDate.toISOString()) : null)
        setProjectsWithOverdue(overdueProjectCount)
      } catch (err) {
        console.error("Error enriching projects:", err)
      } finally {
        setLoading(false)
      }
    }

    enrichProjectsWithBilling()
  }, [userProjects, projectsLoading])

  const createEmptyProjectBilling = (project) => ({
    id: project.id,
    name: project.projectName || "Untitled Project",
    location: project.projectAddress || "Location not set",
    status: "empty",
    statusText: "No Invoices",
    paymentDue: "-",
    dueDate: "-",
    lastPayment: `Project Started ${project.startDate || "Recently"}`,
    hasInvoices: false,
    hasUnpaid: false
  })

  const calculateProjectBilling = (invoices) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let totalUnpaid = 0
    let overdueAmount = 0
    let hasOverdue = false
    let hasUpcoming = false
    let hasUnpaid = false
    let nextDueDate = null
    let lastPaymentDate = null

    invoices.forEach(invoice => {
      const dueDate = new Date(invoice.dueDate)
      const isOverdue = dueDate < today
      const isPending = invoice.status === 'pending'
      const isPaid = invoice.status === 'paid'

      if (isOverdue || isPending) {
        hasUnpaid = true
      }

      if (isOverdue) {
        overdueAmount += Number(invoice.amount)
        totalUnpaid += Number(invoice.amount)
        hasOverdue = true
      } else if (isPending) {
        totalUnpaid += Number(invoice.amount)
        
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
        if (daysUntilDue <= 14) {
          hasUpcoming = true
        }
      }

      if ((isOverdue || isPending) && (!nextDueDate || dueDate < new Date(nextDueDate))) {
        nextDueDate = invoice.dueDate
      }

      if (isPaid) {
        const paidDate = invoice.updatedAt?.toDate?.() || invoice.createdAt?.toDate?.() || new Date(invoice.createdAt)
        if (!lastPaymentDate || paidDate > new Date(lastPaymentDate)) {
          lastPaymentDate = formatDate(paidDate.toISOString())
        }
      }
    })

    let status = "clear"
    let statusText = "All Clear"

    if (invoices.length === 0) {
      status = "empty"
      statusText = "No Invoices"
    } else if (hasOverdue) {
      status = "action"
      statusText = "Action Required"
    } else if (hasUpcoming) {
      status = "upcoming"
      statusText = "Payment Upcoming"
    }

    return {
      totalUnpaid,
      overdueAmount,
      hasOverdue,
      hasUnpaid,
      status,
      statusText,
      nextDueDate,
      lastPaymentDate: lastPaymentDate || "No payments yet"
    }
  }

  const formatCurrency = (amount) => {
    if (amount === "-" || amount === 0) return "-"
    return `NGN ${Number(amount).toLocaleString()}`
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-"
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case "action":
        return "bg-red-100 text-red-700"
      case "upcoming":
        return "bg-yellow-100 text-yellow-700"
      case "clear":
        return "bg-green-100 text-green-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "action":
        return <IoWarning className="w-4 h-4" />
      case "upcoming":
        return <IoWarning className="w-4 h-4" />
      case "clear":
        return <MdCheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredProjects = enrichedProjects.filter(project => {
    if (activeTab === "all projects") return true
    if (activeTab === "payments due") {
      return project.hasUnpaid && project.status === "action"
    }
    if (activeTab === "paid") {
      return project.status === "clear" && project.hasInvoices
    }
    return true
  })

  if (loading || projectsLoading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="h-32 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (enrichedProjects.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
            <p className="text-gray-500">Manage all your project payments in one place</p>
          </div>
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-xl font-semibold text-gray-900 mb-2">No projects assigned yet</p>
            <p className="text-gray-500">
              Projects assigned to you will appear here with their billing information
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-500">Manage all your project payments in one place</p>
        </div>

        {projectsWithOverdue > 0 && (
          <div className="bg-primary text-white rounded-lg p-4 md:p-6 mb-8 flex items-start gap-4">
            <MdWarning className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-lg mb-1">Payment Attention Required</h2>
              <p className="text-orange-100">
                {projectsWithOverdue} {projectsWithOverdue === 1 ? 'project has' : 'projects have'} outstanding payments that need your attention
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">TOTAL OUTSTANDING (OVERDUE)</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {formatCurrency(totalOutstanding)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">NEXT PAYMENT DUE</p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">
              {nextPaymentDue || "No upcoming payments"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <button className="flex items-center gap-2 text-primary font-semibold hover:text-orange-600">
              <MdFilterList className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {["All Projects", "Payments Due", "Paid"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                  activeTab === tab.toLowerCase()
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <MdLocationOn className="w-4 h-4" />
                        {project.location}
                      </div>
                    </div>
                  </div>
                  {project.status !== "empty" && (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyles(project.status)}`}
                    >
                      {getStatusIcon(project.status)}
                      {project.statusText}
                    </div>
                  )}
                </div>

                {project.status !== "empty" ? (
                  <div className="divide-y divide-gray-200">
                    <div className="p-4 md:p-6 flex items-center justify-between bg-orange-50">
                      <div className="flex items-center gap-3">
                        <MdAttachMoney className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Payment Due</span>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-primary">
                        {formatCurrency(project.paymentDue)}
                      </span>
                    </div>

                    <div className="p-4 md:p-6 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <MdCalendarToday className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Due Date</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{formatDate(project.dueDate)}</span>
                    </div>

                    <div className="p-4 md:p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MdHistory className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Last Payment</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{project.lastPayment}</span>
                    </div>

                    <div className="p-4 md:p-6 pt-6">
                      <button 
                        onClick={() => router.push(`/dashboard/billing/${project.id}`)}
                        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <IoMdDocument className="w-5 h-5" />
                        View Billing
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <IoMdDocument className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">No invoices generated</p>
                    <p className="text-gray-500 text-sm mb-4">for this project yet.</p>
                    <p className="text-gray-400 text-xs">{project.lastPayment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === "payments due" ? "No payments due" : "No paid invoices"}
              </p>
              <p className="text-gray-500">
                {activeTab === "payments due" 
                  ? "All your invoices are up to date" 
                  : "Paid invoices will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
