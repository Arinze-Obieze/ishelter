"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { IoArrowBack, IoDownload, IoCopy, IoMail } from "react-icons/io5"
import { MdPayment } from "react-icons/md"
import { FaTimes, FaCreditCard, FaUniversity, FaCheck } from "react-icons/fa"
import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import toast from "react-hot-toast"
// Dynamic import for jsPDF to avoid SSR issues
let jsPDF = null
if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default
  })
}

export default function BillingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.billing

  const [projectData, setProjectData] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("invoices")
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [copiedField, setCopiedField] = useState(null)

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              displayName: userData.displayName || userData.name || user.email,
              name: userData.displayName || userData.name || user.email
            })
          }
        } catch (err) {
          console.error("Error fetching user:", err)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  // Fetch project and invoices
  useEffect(() => {
    if (!projectId) return

    const fetchProjectBilling = async () => {
      try {
        setLoading(true)
        
        const projectRef = doc(db, "projects", projectId)
        const projectSnap = await getDoc(projectRef)

        if (!projectSnap.exists()) {
          toast.error("Project not found")
          router.push("/dashboard/billing")
          return
        }

        const project = projectSnap.data()
        setProjectData({ id: projectSnap.id, ...project })

        const invoiceRefs = project.projectInvoices || []
        const invoicesData = []
        
        for (const invoiceRef of invoiceRefs) {
          try {
            const invoiceSnap = await getDoc(invoiceRef)
            if (invoiceSnap.exists()) {
              const invoiceData = invoiceSnap.data()
              const dueDate = new Date(invoiceData.dueDate)
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const isOverdue = dueDate < today || invoiceData.status === 'overdue'
              
              invoicesData.push({
                id: invoiceSnap.id,
                ...invoiceData,
                isOverdue,
                displayStatus: isOverdue ? 'overdue' : invoiceData.status
              })
            }
          } catch (err) {
            console.error("Error fetching invoice:", err)
          }
        }

        invoicesData.sort((a, b) => {
          const dateA = new Date(a.createdAt?.seconds * 1000 || a.createdAt)
          const dateB = new Date(b.createdAt?.seconds * 1000 || b.createdAt)
          return dateB - dateA
        })

        setInvoices(invoicesData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching project billing:", err)
        if (err.code === 'permission-denied') {
          toast.error("You don't have access to this project")
        } else {
          toast.error("Failed to load billing information")
        }
        router.push("/dashboard/billing")
      }
    }

    fetchProjectBilling()
  }, [projectId, router])

  const currentInvoices = invoices.filter(inv => 
    inv.displayStatus === 'pending' || inv.displayStatus === 'overdue'
  )
  const pastInvoices = invoices.filter(inv => inv.displayStatus === 'paid')

  const paymentDueAmount = currentInvoices
    .filter(inv => inv.displayStatus === 'overdue')
    .reduce((sum, inv) => sum + Number(inv.amount), 0)

  const formatCurrency = (amount) => {
    return `NGN ${Number(amount).toLocaleString()}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      let date
      if (dateString.seconds) {
        date = new Date(dateString.seconds * 1000)
      } else {
        date = new Date(dateString)
      }
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    if (status === "pending") return "text-orange-600 bg-orange-50"
    if (status === "overdue") return "text-red-600 bg-red-50"
    return "text-teal-600 bg-teal-50"
  }

  const getStatusLabel = (invoice) => {
    if (invoice.displayStatus === "pending") return "Due"
    if (invoice.displayStatus === "overdue") return "Overdue"
    return "Paid"
  }

  const getDaysStatus = (invoice) => {
    if (invoice.displayStatus === "paid") return ""
    
    const dueDate = new Date(invoice.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`
    } else {
      return `${diffDays} days left`
    }
  }

  // Generate PDF Invoice
  const generateInvoicePDF = async (invoice) => {
    // Dynamically import jsPDF
    const { default: jsPDF } = await import('jspdf')
    
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // Header - iSHELTER Logo
    pdf.setFontSize(24)
    pdf.setFont("helvetica", "bold")
    pdf.text("i", 20, 20)
    pdf.setTextColor(249, 115, 22) // Orange color
    pdf.text("SHELTER", 27, 20)
    pdf.setTextColor(0, 0, 0)
    
    // Company details
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text("Everythingshelter Nig Ltd", 20, 28)
    pdf.text("ishelter.everythingshelter.com.ng", 20, 33)
    pdf.text("+234 803 484 5266", 20, 38)
    pdf.text("everything@everythingshelter.com.ng", 20, 43)
    
    // Invoice Title
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.text("INVOICE", pageWidth - 60, 20)
    
    // Status Watermark
    pdf.setFontSize(40)
    pdf.setTextColor(200, 200, 200)
    pdf.setFont("helvetica", "bold")
    const statusText = invoice.displayStatus === 'paid' ? 'PAID' : 
                       invoice.displayStatus === 'overdue' ? 'OVERDUE' : 'PENDING'
    const statusColor = invoice.displayStatus === 'paid' ? [16, 185, 129] : 
                        invoice.displayStatus === 'overdue' ? [239, 68, 68] : [249, 115, 22]
    pdf.setTextColor(...statusColor)
    pdf.text(statusText, pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 })
    pdf.setTextColor(0, 0, 0)
    
    // Invoice details box
    pdf.setFillColor(249, 250, 251)
    pdf.rect(pageWidth - 80, 30, 60, 30, 'F')
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.text("Invoice Number:", pageWidth - 75, 38)
    pdf.text("Issue Date:", pageWidth - 75, 45)
    pdf.text("Due Date:", pageWidth - 75, 52)
    
    pdf.setFont("helvetica", "normal")
    pdf.text(invoice.invoiceNumber, pageWidth - 75, 42)
    pdf.text(formatDate(invoice.createdAt), pageWidth - 75, 49)
    pdf.text(formatDate(invoice.dueDate), pageWidth - 75, 56)
    
    // Bill To Section
    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.text("BILL TO:", 20, 65)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.text(currentUser?.displayName || "Client", 20, 72)
    pdf.text(currentUser?.email || "", 20, 77)
    pdf.text(projectData?.projectName || "", 20, 82)
    pdf.text(projectData?.projectAddress || "", 20, 87)
    
    // Line separator
    pdf.setDrawColor(229, 231, 235)
    pdf.setLineWidth(0.5)
    pdf.line(20, 95, pageWidth - 20, 95)
    
    // Invoice Items Header
    pdf.setFillColor(249, 115, 22)
    pdf.rect(20, 100, pageWidth - 40, 10, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.text("Description", 25, 106)
    pdf.text("Amount", pageWidth - 50, 106)
    
    // Invoice Items
    pdf.setTextColor(0, 0, 0)
    pdf.setFont("helvetica", "normal")
    const description = invoice.description || "Project Payment"
    const wrappedText = pdf.splitTextToSize(description, pageWidth - 90)
    pdf.text(wrappedText, 25, 116)
    pdf.text(formatCurrency(invoice.amount), pageWidth - 50, 116)
    
    // Total
    pdf.setDrawColor(229, 231, 235)
    pdf.line(20, 125, pageWidth - 20, 125)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(12)
    pdf.text("TOTAL:", pageWidth - 80, 135)
    pdf.setTextColor(249, 115, 22)
    pdf.text(formatCurrency(invoice.amount), pageWidth - 50, 135)
    pdf.setTextColor(0, 0, 0)
    
    // Payment Information
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "bold")
    pdf.text("PAYMENT INFORMATION:", 20, 150)
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    
    if (invoice.paymentMethod === 'link' && invoice.paymentLink) {
      pdf.text("Pay via Flutterwave:", 20, 158)
      pdf.setTextColor(37, 99, 235)
      pdf.textWithLink("Click here to pay", 20, 165, { url: invoice.paymentLink })
      pdf.setTextColor(0, 0, 0)
      pdf.text(invoice.paymentLink, 20, 172, { maxWidth: pageWidth - 40 })
    } else if (invoice.paymentMethod === 'account') {
      pdf.text("Bank Transfer Details:", 20, 158)
      pdf.setFont("helvetica", "bold")
      pdf.text("Account Name:", 25, 165)
      pdf.setFont("helvetica", "normal")
      pdf.text(invoice.accountName || "", 70, 165)
      pdf.setFont("helvetica", "bold")
      pdf.text("Account Number:", 25, 172)
      pdf.setFont("helvetica", "normal")
      pdf.text(invoice.accountNumber || "", 70, 172)
      pdf.setFont("helvetica", "bold")
      pdf.text("Bank Name:", 25, 179)
      pdf.setFont("helvetica", "normal")
      pdf.text(invoice.bankName || "", 70, 179)
      pdf.setFont("helvetica", "bold")
      pdf.text("Reference:", 25, 186)
      pdf.setFont("helvetica", "normal")
      pdf.text(invoice.invoiceNumber, 70, 186)
    }
    
    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(107, 114, 128)
    pdf.text("Thank you for your business!", pageWidth / 2, pageHeight - 20, { align: 'center' })
    pdf.text("For inquiries, contact us at everything@everythingshelter.com.ng", pageWidth / 2, pageHeight - 15, { align: 'center' })
    
    // Generate filename
    const projectName = projectData?.projectName?.replace(/[^a-z0-9]/gi, '-') || 'Project'
    const filename = `Invoice-${invoice.invoiceNumber}-${projectName}.pdf`
    
    return { pdf, filename }
  }

  const handleDownload = async (invoice) => {
    try {
      const { pdf, filename } = await generateInvoicePDF(invoice)
      pdf.save(filename)
      toast.success("Invoice downloaded successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate invoice PDF")
    }
  }

  const handleEmailInvoice = async (invoice) => {
    if (!currentUser) {
      toast.error("User information not available")
      return
    }

    const toastId = toast.loading("Sending invoice...")
    
    try {
      const paymentDetails = invoice.paymentMethod === 'link' && invoice.paymentLink
        ? `<a href="${invoice.paymentLink}" style="display: inline-block; background: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">Pay Now via Flutterwave</a>`
        : `<div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">Bank Transfer Details:</h3>
            <p style="margin: 5px 0;"><strong>Account Name:</strong> ${invoice.accountName || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Account Number:</strong> ${invoice.accountNumber || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Bank Name:</strong> ${invoice.bankName || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Payment Reference:</strong> ${invoice.invoiceNumber}</p>
          </div>`

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: currentUser.email,
          subject: `Invoice ${invoice.invoiceNumber} - ${projectData?.projectName || 'Project'}`,
          name: currentUser.displayName,
          message: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">
                  <span style="color: white;">i</span>SHELTER
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Everythingshelter Nig Ltd</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
                <h2 style="color: #111827; margin: 0 0 20px 0;">Invoice for ${projectData?.projectName || 'Your Project'}</h2>
                <p style="color: #6b7280; margin: 0 0 20px 0;">Dear ${currentUser.displayName},</p>
                <p style="color: #6b7280; margin: 0 0 20px 0;">Please find your invoice details below:</p>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Invoice Number:</td>
                      <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${invoice.invoiceNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount:</td>
                      <td style="padding: 8px 0; color: #f97316; font-weight: bold; text-align: right; font-size: 18px;">${formatCurrency(invoice.amount)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Due Date:</td>
                      <td style="padding: 8px 0; color: #111827; font-weight: bold; text-align: right;">${formatDate(invoice.dueDate)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Status:</td>
                      <td style="padding: 8px 0; text-align: right;">
                        <span style="background: ${invoice.displayStatus === 'paid' ? '#d1fae5' : invoice.displayStatus === 'overdue' ? '#fee2e2' : '#fed7aa'}; 
                                     color: ${invoice.displayStatus === 'paid' ? '#065f46' : invoice.displayStatus === 'overdue' ? '#991b1b' : '#9a3412'}; 
                                     padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                          ${getStatusLabel(invoice).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>

                ${invoice.description ? `<p style="color: #6b7280; margin: 20px 0;"><strong>Description:</strong> ${invoice.description}</p>` : ''}

                ${paymentDetails}

                <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    <strong style="color: #111827;">Everythingshelter Nig Ltd</strong><br>
                    📧 everything@everythingshelter.com.ng<br>
                    📞 +234 803 484 5266<br>
                    🌐 <a href="https://ishelter.everythingshelter.com.ng" style="color: #f97316; text-decoration: none;">ishelter.everythingshelter.com.ng</a>
                  </p>
                </div>

                <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0 0; text-align: center;">
                  This is an automated email. Please do not reply to this message.
                </p>
              </div>
            </div>
          `
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Invoice sent to your email!", { id: toastId })
      } else {
        throw new Error(data.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error("Failed to send invoice email", { id: toastId })
    }
  }

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error("Failed to copy")
    }
  }

  const handlePayNow = (invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  // Payment Modal Component
  const PaymentModal = () => {
    if (!selectedInvoice) return null

    return (
      <div className="backdrop-overlay flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Invoice Number</p>
              <p className="text-lg font-bold text-gray-900">{selectedInvoice.invoiceNumber}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Amount Due</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(selectedInvoice.amount)}</p>
            </div>
          </div>

          {/* Payment Method Display */}
          {selectedInvoice.paymentMethod === 'link' && selectedInvoice.paymentLink ? (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaCreditCard className="text-primary" />
                <p className="font-semibold text-gray-900">Pay via Flutterwave Link</p>
              </div>
              <a
                href={selectedInvoice.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg text-center transition mb-3"
              >
                Proceed to Payment
              </a>
            </div>
          ) : selectedInvoice.paymentMethod === 'account' ? (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FaUniversity className="text-primary" />
                <p className="font-semibold text-gray-900">Bank Transfer Details</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Name</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{selectedInvoice.accountName}</p>
                    <button
                      onClick={() => handleCopy(selectedInvoice.accountName, 'accountName')}
                      className="text-primary hover:text-orange-600 p-1"
                    >
                      {copiedField === 'accountName' ? <FaCheck size={16} /> : <IoCopy size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 font-mono">{selectedInvoice.accountNumber}</p>
                    <button
                      onClick={() => handleCopy(selectedInvoice.accountNumber, 'accountNumber')}
                      className="text-primary hover:text-orange-600 p-1"
                    >
                      {copiedField === 'accountNumber' ? <FaCheck size={16} /> : <IoCopy size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{selectedInvoice.bankName}</p>
                    <button
                      onClick={() => handleCopy(selectedInvoice.bankName, 'bankName')}
                      className="text-primary hover:text-orange-600 p-1"
                    >
                      {copiedField === 'bankName' ? <FaCheck size={16} /> : <IoCopy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Please use invoice number <strong>{selectedInvoice.invoiceNumber}</strong> as your payment reference
              </p>
            </div>
          ) : (
            <div className="mb-6 text-center text-gray-500">
              <p>Payment information not available</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 mb-4">
            <button
              onClick={() => handleDownload(selectedInvoice)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <IoDownload />
              Download Invoice
            </button>
            <button
              onClick={() => handleEmailInvoice(selectedInvoice)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <IoMail />
              Email Invoice
            </button>
          </div>

          <button
            onClick={() => setShowPaymentModal(false)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  // Display invoices based on active tab
  const displayedInvoices = activeTab === "invoices" ? invoices : pastInvoices

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
          <button 
            onClick={() => router.push("/dashboard/billing")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-orange-600"
          >
            Back to Billing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-6">
          <button 
            onClick={() => router.push("/dashboard/billing")}
            className="flex items-center gap-2 text-orange-600 font-medium mb-3 hover:opacity-80 text-sm md:text-base"
          >
            <IoArrowBack className="w-4 h-4 md:w-5 md:h-5" />
            Back to Billing
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">
            {projectData.projectName || "Project"}
          </h1>
          <p className="text-xs md:text-base text-gray-500">
            {projectData.projectAddress || "Billing & Payments"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 md:px-6">
        {/* Payment Due Banner */}
        {paymentDueAmount > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-600 text-white">
                    <MdPayment className="w-4 h-4 md:w-6 md:h-6" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm md:text-lg font-bold text-gray-900 mb-1">
                    Payment Overdue ({currentInvoices.filter(i => i.displayStatus === 'overdue').length} {currentInvoices.filter(i => i.displayStatus === 'overdue').length === 1 ? 'Invoice' : 'Invoices'})
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600">
                    You have overdue invoices that require immediate attention
                  </p>
                </div>
              </div>
              <div className="w-full md:w-auto md:text-right">
                <p className="text-gray-600 text-sm mb-1">Total Overdue Amount</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">
                  {formatCurrency(paymentDueAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 md:gap-8 mb-6 md:mb-8 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`py-3 md:py-4 px-2 font-medium border-b-2 transition text-sm md:text-base whitespace-nowrap ${
              activeTab === "invoices"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <span className="inline-block">All Invoices</span>
            <span className="inline-block ml-2 px-2 py-0.5 md:py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
              {invoices.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 md:py-4 px-2 font-medium border-b-2 transition text-sm md:text-base whitespace-nowrap ${
              activeTab === "history"
                ? "text-orange-600 border-orange-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            <span className="inline-block">Payment History</span>
            <span className="inline-block ml-2 px-2 py-0.5 md:py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
              {pastInvoices.length}
            </span>
          </button>
        </div>

        {/* Current Invoices - Show in "All Invoices" tab */}
        {activeTab === "invoices" && currentInvoices.length > 0 && (
          <div className="mb-10 md:mb-12">
            <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Current Invoices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {currentInvoices.map((invoice) => (
                <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{invoice.invoiceNumber}</h4>
                    <span
                      className={`text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full ${getStatusBadge(invoice.displayStatus)}`}
                    >
                      {getStatusLabel(invoice)}
                    </span>
                  </div>

                  {invoice.description && (
                    <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Issued Date</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{formatDate(invoice.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Due Date</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                    <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Amount</p>
                    <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Status: {getDaysStatus(invoice)}
                    </p>
                  </div>

                  <div className="flex gap-2 md:gap-3">
                    <button 
                      onClick={() => handleDownload(invoice)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50"
                    >
                      <IoDownload className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <button 
                      onClick={() => handlePayNow(invoice)}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition text-xs md:text-sm"
                    >
                      💳 Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Invoices - Show in both tabs */}
        {((activeTab === "invoices" && pastInvoices.length > 0) || activeTab === "history") && (
          <div>
            {activeTab === "invoices" && <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Past Invoices</h3>}
            
            {pastInvoices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {pastInvoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                    <div className="flex items-start justify-between mb-3 md:mb-4">
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{invoice.invoiceNumber}</h4>
                      <span
                        className={`text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full ${getStatusBadge(invoice.displayStatus)}`}
                      >
                        Paid
                      </span>
                    </div>

                    {invoice.description && (
                      <p className="text-sm text-gray-600 mb-3">{invoice.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Issued Date</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">{formatDate(invoice.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Paid Date</p>
                        <p className="font-semibold text-gray-900 text-sm md:text-base">{formatDate(invoice.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                      <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Amount</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>

                    <div className="flex gap-2 md:gap-3">
                      <button 
                        onClick={() => handleDownload(invoice)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50"
                      >
                        <IoDownload className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                      <button 
                        onClick={() => handleEmailInvoice(invoice)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50"
                      >
                        <IoMail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-xl font-semibold text-gray-900 mb-2">No payment history yet</p>
                <p className="text-gray-500">
                  Paid invoices will appear here once payments are processed
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {invoices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</p>
            <p className="text-gray-500">
              Invoices for this project will appear here once generated
            </p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && <PaymentModal />}
    </div>
  )
}