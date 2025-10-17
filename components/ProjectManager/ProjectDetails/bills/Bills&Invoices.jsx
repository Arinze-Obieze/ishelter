// components/ProjectManager/ProjectDetails/bills/Bills&Invoices.js
import { useState, useEffect } from "react"
import { db, auth } from "@/lib/firebase"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import TabsNavigation from "@/components/ProjectManager/ProjectDetails/TabsNavigation"
import BudgetStats from "@/components/ProjectManager/ProjectDetails/bills/stats"
import InvoicesSection from "@/components/ProjectManager/ProjectDetails/bills/invoice"
import { useInvoice } from "@/contexts/InvoiceContext"

export default function BillingTab({ projectId, tabs, activeTab, onTabChange }) {
  const [budgetData, setBudgetData] = useState({
    total: 0,
    spent: 0,
    remaining: 0,
    percentageUsed: 0,
    status: "Healthy",
    statusColor: "bg-green-50 border-green-300 text-green-700",
  })
  
  const [currentUser, setCurrentUser] = useState(null)
  
  const { 
    invoices, 
    loading, 
    error,
    fetchInvoices, 
    createInvoice, 
    updateInvoiceStatus, 
    deleteInvoice,
    clearInvoices
  } = useInvoice()

  // Get current user from Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    
    return () => unsubscribe()
  }, [])

  // Fetch budget data from project timeline
  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const projectRef = doc(db, "projects", projectId)
        const projectSnap = await getDoc(projectRef)
        
        if (projectSnap.exists()) {
          const data = projectSnap.data()
          const taskTimeline = data.taskTimeline || []
          
          // Calculate total budget from timeline
          const totalBudget = taskTimeline.reduce((sum, stage) => {
            const stageCost = parseCost(stage.cost)
            const tasksCost = (stage.tasks || []).reduce((s, t) => s + parseCost(t.cost), 0)
            return sum + stageCost + tasksCost
          }, 0)
          
          // Calculate spent amount from completed stages/tasks
          const costIncurred = taskTimeline.reduce((sum, stage) => {
            const stageCost = stage.status === "Completed" ? parseCost(stage.cost) : 0
            const tasksCost = (stage.tasks || []).reduce((s, t) => 
              t.status === "Completed" ? s + parseCost(t.cost) : s, 0)
            return sum + stageCost + tasksCost
          }, 0)
          
          const remaining = totalBudget - costIncurred
          const percentageUsed = totalBudget > 0 ? (costIncurred / totalBudget) * 100 : 0
          
          // Determine budget status
          let status = "Healthy"
          let statusColor = "bg-green-50 border-green-300 text-green-700"
          
          if (percentageUsed > 90) {
            status = "Critical"
            statusColor = "bg-red-50 border-red-300 text-red-700"
          } else if (percentageUsed > 75) {
            status = "Warning"
            statusColor = "bg-yellow-50 border-yellow-300 text-yellow-700"
          }
          
          setBudgetData({
            total: totalBudget,
            spent: costIncurred,
            remaining,
            percentageUsed,
            status,
            statusColor,
          })
        }
      } catch (error) {
        console.error("Error fetching budget data:", error)
      }
    }
    
    if (projectId) {
      fetchBudgetData()
    }
  }, [projectId])

  // Fetch invoices when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchInvoices(projectId)
    }
    
    // Cleanup when component unmounts or projectId changes
    return () => {
      clearInvoices()
    }
  }, [projectId])

  // Helper functions
  const parseCost = (cost) => {
    if (!cost) return 0
    if (typeof cost === "number") return cost
    return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0
  }

  const formatCurrency = (amount) => {
    return `NGN ${Number(amount).toLocaleString()}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
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
    return `${circumference * (percentage / 100)} ${circumference}`
  }

  // Calculate paid amount from invoices
  const paidAmount = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  // Handle create invoice
  const handleCreateInvoice = async (invoiceData) => {
    if (!currentUser) {
      alert("You must be logged in to create an invoice")
      return { success: false, error: "Not authenticated" }
    }

    const result = await createInvoice({
      ...invoiceData,
      createdBy: currentUser.uid
    }, projectId)
    
    return result
  }

  // Handle update invoice status
  const handleUpdateInvoiceStatus = async (invoiceId, newStatus) => {
    const result = await updateInvoiceStatus(invoiceId, newStatus)
    return result
  }

  // Handle delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    const result = await deleteInvoice(invoiceId, projectId)
    return result
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="px-4 py-6 md:px-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Project Billing & Invoices</h1>
      </div>

      <div className="mb-6 mt-8 bg-white">
        <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto bg-gray-50">
        {/* Budget Stats Component */}
        <BudgetStats
          budgetData={budgetData}
          paidAmount={paidAmount}
          formatCurrency={formatCurrency}
          calculateStrokeDasharray={calculateStrokeDasharray}
        />

        {/* Invoices Section Component */}
        <InvoicesSection
          invoices={invoices}
          loading={loading}
          error={error}
          onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
          onDeleteInvoice={handleDeleteInvoice}
          onCreateInvoice={handleCreateInvoice}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusConfig={getStatusConfig}
        />
      </div>
    </div>
  )
}