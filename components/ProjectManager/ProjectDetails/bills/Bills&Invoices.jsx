import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import TabsNavigation from "@/components/ProjectManager/ProjectDetails/TabsNavigation"
import BudgetStats from "@/components/ProjectManager/ProjectDetails/bills/stats"
import InvoicesSection from "@/components/ProjectManager/ProjectDetails/bills/invoice"

export default function BillingTab({ projectId, tabs, activeTab, onTabChange }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [budgetData, setBudgetData] = useState({
    total: 0,
    spent: 0,
    remaining: 0,
    percentageUsed: 0,
    status: "Healthy",
    statusColor: "bg-green-50 border-green-300 text-green-700",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    amount: "",
    description: "",
    dueDate: "",
  })

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
          const percentageUsed = totalBudget > 0 ? costIncurred / totalBudget : 0
          
          // Determine budget status
          let status = "Healthy"
          let statusColor = "bg-green-50 border-green-300 text-green-700"
          
          if (percentageUsed > 0.9) {
            status = "Critical"
            statusColor = "bg-red-50 border-red-300 text-red-700"
          } else if (percentageUsed > 0.75) {
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
    
    fetchBudgetData()
  }, [projectId])

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/invoices/create?projectId=${projectId}`)
        const data = await response.json()
        
        if (data.invoices) {
          // Check for overdue invoices
          const processedInvoices = data.invoices.map(inv => {
            const dueDate = new Date(inv.dueDate)
            const now = new Date()
            const isOverdue = inv.status === "pending" && dueDate < now
            
            return {
              ...inv,
              status: isOverdue ? "overdue" : inv.status
            }
          })
          setInvoices(processedInvoices)
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoices()
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

  // Calculate paid amount from invoices
  const paidAmount = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const handleCreateInvoice = async (e) => {
    e.preventDefault()
    
    if (!newInvoice.amount || !newInvoice.dueDate) {
      alert("Please fill in all required fields")
      return
    }
    
    setCreating(true)
    try {
      const response = await fetch("/api/invoices/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          amount: Number(newInvoice.amount),
          description: newInvoice.description,
          dueDate: newInvoice.dueDate,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`Invoice created successfully! Payment link sent to ${data.sentTo.join(", ")}`)
        setShowCreateModal(false)
        setNewInvoice({ amount: "", description: "", dueDate: "" })
        
        // Refresh invoices
        const refreshRes = await fetch(`/api/invoices/create?projectId=${projectId}`)
        const refreshData = await refreshRes.json()
        if (refreshData.invoices) {
          setInvoices(refreshData.invoices)
        }
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      alert("Failed to create invoice")
    } finally {
      setCreating(false)
    }
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
          showCreateModal={showCreateModal}
          creating={creating}
          newInvoice={newInvoice}
          setShowCreateModal={setShowCreateModal}
          setNewInvoice={setNewInvoice}
          handleCreateInvoice={handleCreateInvoice}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusConfig={getStatusConfig}
        />
      </div>
    </div>
  )
}