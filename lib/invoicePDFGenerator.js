/**
 * Generate a professional invoice PDF
 * This function should only be called on the client side
 * @param {Object} invoice - Invoice data
 * @param {Object} projectData - Project information
 * @param {Object} currentUser - Current user information
 * @returns {Promise<Object>} { pdf, filename }
 */
export async function generateInvoicePDF(invoice, projectData, currentUser) {
  // Dynamically import jsPDF
  const { default: jsPDF } = await import('jspdf')
  
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `NGN ${Number(amount).toLocaleString()}`
  }
  
  // Helper function to format date
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
  
  // ===== HEADER SECTION =====
  // iSHELTER Logo
  pdf.setFontSize(24)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(0, 0, 0)
  pdf.text("i", 20, 20)
  pdf.setTextColor(249, 115, 22) // Orange color
  pdf.text("SHELTER", 27, 20)
  pdf.setTextColor(0, 0, 0)
  
  // Company details
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text("Everythingshelter Nig Ltd", 20, 28)
  pdf.setTextColor(100, 100, 100)
  pdf.text("ishelter.everythingshelter.com.ng", 20, 33)
  pdf.text("+234 803 484 5266", 20, 38)
  pdf.text("everything@everythingshelter.com.ng", 20, 43)
  pdf.setTextColor(0, 0, 0)
  
  // Invoice Title
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.text("INVOICE", pageWidth - 60, 20)
  
  // ===== STATUS WATERMARK =====
  pdf.setFontSize(40)
  pdf.setFont("helvetica", "bold")
  const statusText = invoice.displayStatus === 'paid' ? 'PAID' : 
                     invoice.displayStatus === 'overdue' ? 'OVERDUE' : 'PENDING'
  const statusColor = invoice.displayStatus === 'paid' ? [16, 185, 129] : 
                      invoice.displayStatus === 'overdue' ? [239, 68, 68] : [249, 115, 22]
  pdf.setTextColor(...statusColor)
  pdf.setGState(pdf.GState({ opacity: 0.1 }))
  pdf.text(statusText, pageWidth / 2, pageHeight / 2, { 
    align: 'center', 
    angle: 45 
  })
  pdf.setGState(pdf.GState({ opacity: 1 }))
  pdf.setTextColor(0, 0, 0)
  
  // ===== INVOICE DETAILS BOX =====
  pdf.setFillColor(249, 250, 251)
  pdf.rect(pageWidth - 80, 30, 60, 35, 'F')
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(100, 100, 100)
  pdf.text("Invoice Number:", pageWidth - 75, 36)
  pdf.text("Issue Date:", pageWidth - 75, 44)
  pdf.text("Due Date:", pageWidth - 75, 52)
  pdf.text("Status:", pageWidth - 75, 60)
  
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(0, 0, 0)
  pdf.text(invoice.invoiceNumber || "N/A", pageWidth - 75, 40)
  pdf.text(formatDate(invoice.createdAt), pageWidth - 75, 48)
  pdf.text(formatDate(invoice.dueDate), pageWidth - 75, 56)
  
  // Status badge
  pdf.setFontSize(8)
  pdf.setTextColor(...statusColor)
  pdf.text(statusText, pageWidth - 75, 63)
  pdf.setTextColor(0, 0, 0)
  
  // ===== BILL TO SECTION =====
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text("BILL TO:", 20, 70)
  
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  pdf.text(currentUser?.displayName || currentUser?.name || "Client", 20, 77)
  pdf.setTextColor(100, 100, 100)
  pdf.text(currentUser?.email || "", 20, 82)
  pdf.setTextColor(0, 0, 0)
  
  // Project details
  pdf.setFont("helvetica", "bold")
  pdf.text("Project:", 20, 89)
  pdf.setFont("helvetica", "normal")
  pdf.text(projectData?.projectName || "N/A", 40, 89)
  
  if (projectData?.projectAddress) {
    pdf.setTextColor(100, 100, 100)
    const addressLines = pdf.splitTextToSize(projectData.projectAddress, pageWidth - 45)
    pdf.text(addressLines, 20, 94)
    pdf.setTextColor(0, 0, 0)
  }
  
  // ===== LINE SEPARATOR =====
  pdf.setDrawColor(229, 231, 235)
  pdf.setLineWidth(0.5)
  pdf.line(20, 105, pageWidth - 20, 105)
  
  // ===== INVOICE ITEMS TABLE =====
  // Table Header
  pdf.setFillColor(249, 115, 22)
  pdf.rect(20, 110, pageWidth - 40, 10, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(10)
  pdf.text("Description", 25, 116)
  pdf.text("Amount", pageWidth - 50, 116)
  
  // Table Content
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "normal")
  const description = invoice.description || "Project Payment"
  const wrappedText = pdf.splitTextToSize(description, pageWidth - 90)
  let yPosition = 126
  pdf.text(wrappedText, 25, yPosition)
  
  // Amount aligned to the right
  pdf.setFont("helvetica", "bold")
  pdf.text(formatCurrency(invoice.amount), pageWidth - 50, yPosition, { align: 'left' })
  
  // Adjust yPosition based on wrapped text height
  yPosition += (wrappedText.length * 5) + 5
  
  // ===== TOTAL SECTION =====
  pdf.setDrawColor(229, 231, 235)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10
  
  pdf.setFont("helvetica", "bold")
  pdf.setFontSize(12)
  pdf.text("TOTAL:", pageWidth - 80, yPosition)
  pdf.setTextColor(249, 115, 22)
  pdf.setFontSize(14)
  pdf.text(formatCurrency(invoice.amount), pageWidth - 50, yPosition, { align: 'left' })
  pdf.setTextColor(0, 0, 0)
  
  yPosition += 15
  
  // ===== PAYMENT INFORMATION =====
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "bold")
  pdf.text("PAYMENT INFORMATION:", 20, yPosition)
  yPosition += 8
  
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "normal")
  
  if (invoice.paymentMethod === 'link' && invoice.paymentLink) {
    pdf.text("Pay via Flutterwave:", 20, yPosition)
    yPosition += 7
    pdf.setTextColor(37, 99, 235)
    pdf.textWithLink("Click here to pay online", 20, yPosition, { url: invoice.paymentLink })
    yPosition += 7
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    const linkText = pdf.splitTextToSize(invoice.paymentLink, pageWidth - 40)
    pdf.text(linkText, 20, yPosition)
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
  } else if (invoice.paymentMethod === 'account') {
    // Bank details box
    pdf.setFillColor(240, 249, 255)
    pdf.rect(20, yPosition - 5, pageWidth - 40, 40, 'F')
    pdf.setDrawColor(59, 130, 246)
    pdf.setLineWidth(2)
    pdf.line(20, yPosition - 5, 20, yPosition + 35)
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Bank Transfer Details:", 25, yPosition)
    yPosition += 7
    
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Account Name:", 30, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.text(invoice.accountName || "N/A", 75, yPosition)
    yPosition += 7
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Account Number:", 30, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.setFont("courier", "bold")
    pdf.text(invoice.accountNumber || "N/A", 75, yPosition)
    pdf.setFont("helvetica", "normal")
    yPosition += 7
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Bank Name:", 30, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.text(invoice.bankName || "N/A", 75, yPosition)
    yPosition += 7
    
    pdf.setFont("helvetica", "bold")
    pdf.text("Payment Reference:", 30, yPosition)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(249, 115, 22)
    pdf.text(invoice.invoiceNumber, 75, yPosition)
    pdf.setTextColor(0, 0, 0)
    
    yPosition += 10
  }
  
  // ===== NOTES/TERMS =====
  yPosition += 10
  if (yPosition < pageHeight - 40) {
    pdf.setFillColor(255, 251, 235)
    pdf.rect(20, yPosition, pageWidth - 40, 20, 'F')
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    pdf.text("Important Notes:", 25, yPosition + 6)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(100, 100, 100)
    pdf.text("• Please include the invoice number as payment reference", 25, yPosition + 11)
    pdf.text("• Contact us immediately if you have any questions about this invoice", 25, yPosition + 16)
    pdf.setTextColor(0, 0, 0)
  }
  
  // ===== FOOTER =====
  pdf.setDrawColor(229, 231, 235)
  pdf.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30)
  
  pdf.setFontSize(9)
  pdf.setTextColor(107, 114, 128)
  pdf.setFont("helvetica", "italic")
  pdf.text("Thank you for your business!", pageWidth / 2, pageHeight - 23, { align: 'center' })
  
  pdf.setFont("helvetica", "normal")
  pdf.setFontSize(8)
  pdf.text("Everythingshelter Nig Ltd", pageWidth / 2, pageHeight - 18, { align: 'center' })
  pdf.text("everything@everythingshelter.com.ng  •  +234 803 484 5266", pageWidth / 2, pageHeight - 14, { align: 'center' })
  pdf.text("ishelter.everythingshelter.com.ng", pageWidth / 2, pageHeight - 10, { align: 'center' })
  
  // ===== GENERATE FILENAME =====
  const projectName = projectData?.projectName?.replace(/[^a-z0-9]/gi, '-') || 'Project'
  const filename = `Invoice-${invoice.invoiceNumber}-${projectName}.pdf`
  
  return { pdf, filename }
}

export default generateInvoicePDF