import { useState } from "react"
import toast from "react-hot-toast"
import { FaPlus, FaTimes, FaEdit, FaTrash, FaCreditCard, FaUniversity } from "react-icons/fa"

export default function InvoicesSection({ 
  invoices, 
  loading, 
  error,
  onUpdateInvoiceStatus, 
  onDeleteInvoice, 
  onCreateInvoice,
  formatCurrency,
  formatDate,
  getStatusConfig 
}) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const [newInvoice, setNewInvoice] = useState({
    amount: "",
    description: "",
    dueDate: "",
    paymentMethod: "link", 
    paymentLink: "",
    accountName: "",
    accountNumber: "",
    bankName: ""
  })

  // Process invoices for display
  const processedInvoices = invoices.map(invoice => {
    const statusConfig = getStatusConfig(invoice.status)
    return {
      ...invoice,
      formattedAmount: formatCurrency(invoice.amount),
      formattedDateIssued: formatDate(invoice.createdAt),
      formattedDueDate: formatDate(invoice.dueDate),
      statusColor: statusConfig.color,
      statusLabel: statusConfig.label,
      isOverdue: invoice.status === 'overdue',
      canDelete: invoice.status === 'pending' || invoice.status === 'overdue'
    }
  })

  const handleCreateInvoice = async (e) => {
    e.preventDefault()
    
    // Validate required fields based on payment method
    if (!newInvoice.amount || !newInvoice.dueDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (newInvoice.paymentMethod === "link" && !newInvoice.paymentLink) {
      toast.error("Please provide a payment link")
      return
    }

    if (newInvoice.paymentMethod === "account" && (!newInvoice.accountName || !newInvoice.accountNumber || !newInvoice.bankName)) {
      toast.error("Please fill in all account details")
      return
    }
    
    setCreating(true)
    try {
      const invoiceData = {
        amount: Number(newInvoice.amount),
        description: newInvoice.description,
        dueDate: newInvoice.dueDate,
        paymentMethod: newInvoice.paymentMethod,
        ...(newInvoice.paymentMethod === "link" && { paymentLink: newInvoice.paymentLink }),
        ...(newInvoice.paymentMethod === "account" && {
          accountName: newInvoice.accountName,
          accountNumber: newInvoice.accountNumber,
          bankName: newInvoice.bankName
        })
      }
      
      const result = await onCreateInvoice(invoiceData)
      
      if (result.success) {
        toast.success("Invoice created successfully and emails sent to clients!")
        setShowCreateModal(false)
        setNewInvoice({ 
          amount: "", 
          description: "", 
          dueDate: "", 
          paymentMethod: "link",
          paymentLink: "",
          accountName: "",
          accountNumber: "",
          bankName: ""
        })
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast.error("Failed to create invoice")
    } finally {
      setCreating(false)
    }
  }

  const handleUpdateStatus = async (invoiceId, newStatus) => {
    setUpdating(true)
    try {
      const result = await onUpdateInvoiceStatus(invoiceId, newStatus)
      if (result.success) {
        toast.success("Invoice status updated successfully!")
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error updating invoice:", error)
      toast.error("Failed to update invoice")
    } finally {
      setUpdating(false)
      setShowEditModal(false)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!selectedInvoice) return
    
    setDeleting(true)
    try {
      const result = await onDeleteInvoice(selectedInvoice.id)
      if (result.success) {
        toast.success("Invoice deleted successfully!")
      } else {
        toast.error(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting invoice:", error)
      toast.error("Failed to delete invoice")
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
      setSelectedInvoice(null)
    }
  }

  const openEditModal = (invoice) => {
    setSelectedInvoice(invoice)
    setShowEditModal(true)
  }

  const openDeleteModal = (invoice) => {
    setSelectedInvoice(invoice)
    setShowDeleteModal(true)
  }

  const handlePaymentMethodChange = (method) => {
    setNewInvoice({
      ...newInvoice,
      paymentMethod: method,
      // Clear the other method's fields when switching
      ...(method === "link" && { accountName: "", accountNumber: "", bankName: "" }),
      ...(method === "account" && { paymentLink: "" })
    })
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Project Invoices</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <FaPlus />
            <span>Create New Invoice</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading invoices...</p>
          </div>
        ) : processedInvoices.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No invoices created yet.</p>
            <p className="text-sm mt-2">Create your first invoice to start tracking payments.</p>
          </div>
        ) : (
          <>
            {/* Mobile: Invoice List */}
            <div className="md:hidden space-y-4">
              {processedInvoices.map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-lg font-bold text-orange-500 mt-1">{invoice.formattedAmount}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(invoice)}
                        className="text-gray-400 hover:text-blue-600"
                        title="Edit Status"
                      >
                        <FaEdit />
                      </button>
                      {invoice.canDelete && (
                        <button 
                          onClick={() => openDeleteModal(invoice)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Invoice"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                  {invoice.description && (
                    <p className="text-sm text-gray-600 mb-2">{invoice.description}</p>
                  )}
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Issued: {invoice.formattedDateIssued}</span>
                    <span className={invoice.isOverdue ? "text-red-600 font-medium" : "text-gray-900"}>
                      Due: {invoice.formattedDueDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                      {invoice.statusLabel}
                    </span>
                    {invoice.status === "pending" && (
                      <div className="flex items-center gap-2">
                        {invoice.paymentMethod === "link" && invoice.paymentLink && (
                          <a 
                            href={invoice.paymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                          >
                            Payment Link
                          </a>
                        )}
                        {invoice.paymentMethod === "account" && (
                          <span className="text-xs text-gray-500">Bank Transfer</span>
                        )}
                      </div>
                    )}
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount (NGN)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date Issued</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm text-gray-900">{invoice.invoiceNumber}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{invoice.description || "—"}</td>
                      <td className="py-4 px-4 text-sm font-bold text-orange-500">{invoice.formattedAmount}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{invoice.formattedDateIssued}</td>
                      <td className={`py-4 px-4 text-sm ${invoice.isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                        {invoice.formattedDueDate}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {invoice.paymentMethod === "link" ? "Payment Link" : "Bank Transfer"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                          {invoice.statusLabel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {invoice.status === "pending" && (
                            <>
                              {invoice.paymentMethod === "link" && invoice.paymentLink && (
                                <a 
                                  href={invoice.paymentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm"
                                >
                                  Payment Link
                                </a>
                              )}
                              {invoice.paymentMethod === "account" && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Bank Details
                                </span>
                              )}
                            </>
                          )}
                          <button 
                            onClick={() => openEditModal(invoice)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Edit Status"
                          >
                            <FaEdit />
                          </button>
                          {invoice.canDelete && (
                            <button 
                              onClick={() => openDeleteModal(invoice)}
                              className="text-gray-400 hover:text-red-600"
                              title="Delete Invoice"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed backdrop-overlay flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateInvoice} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (NGN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Brief description of the invoice"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("link")}
                    className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                      newInvoice.paymentMethod === "link" 
                        ? "border-primary bg-orange-50 text-primary" 
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <FaCreditCard />
                    <span>Payment Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentMethodChange("account")}
                    className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${
                      newInvoice.paymentMethod === "account" 
                        ? "border-primary bg-orange-50 text-primary" 
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <FaUniversity />
                    <span>Bank Transfer</span>
                  </button>
                </div>
              </div>

              {/* Payment Link Fields */}
              {newInvoice.paymentMethod === "link" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Link (Flutterwave) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={newInvoice.paymentLink}
                    onChange={(e) => setNewInvoice({ ...newInvoice, paymentLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://flutterwave.com/pay/..."
                    required
                  />
                </div>
              )}

              {/* Bank Account Fields */}
              {newInvoice.paymentMethod === "account" && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newInvoice.accountName}
                      onChange={(e) => setNewInvoice({ ...newInvoice, accountName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter account name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newInvoice.accountNumber}
                      onChange={(e) => setNewInvoice({ ...newInvoice, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newInvoice.bankName}
                      onChange={(e) => setNewInvoice({ ...newInvoice, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter bank name"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create & Send"}
                </button>
              </div>
            </form>
            
            <div className="px-6 pb-6">
              <p className="text-xs text-gray-500">
                * Invoice will be automatically sent to all project clients via email
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Status Modal */}
      {showEditModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Update Invoice Status</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Invoice: {selectedInvoice.invoiceNumber}</p>
              <p className="text-lg font-bold text-orange-500">{selectedInvoice.formattedAmount}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                defaultValue={selectedInvoice.status}
                onChange={(e) => handleUpdateStatus(selectedInvoice.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={updating}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                disabled={updating}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Invoice Confirmation Modal */}
      {showDeleteModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Delete Invoice</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete invoice <strong>{selectedInvoice.invoiceNumber}</strong>?
                This action cannot be undone.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> This will permanently delete the invoice and remove it from the system.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteInvoice}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Invoice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}