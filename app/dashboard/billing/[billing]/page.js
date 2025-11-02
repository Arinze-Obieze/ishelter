"use client"

import { useState } from "react"
import { IoArrowBack, IoSearch, IoFilter, IoDownload } from "react-icons/io5"
import { MdPayment } from "react-icons/md"



export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("invoices")

  const currentInvoices = [
    {
      id: "1",
      number: "INV-2023-005",
      issuedDate: "June 25, 2023",
      dueDate: "July 10, 2023",
      amount: "$12,500.00",
      status: "due",
    },
    {
      id: "2",
      number: "INV-2023-004",
      issuedDate: "May 30, 2023",
      dueDate: "June 15, 2023",
      amount: "$8,750.00",
      status: "overdue",
    },
  ]

  const pastInvoices = [
    {
      id: "3",
      number: "INV-2023-003",
      issuedDate: "April 28, 2023",
      paidDate: "May 10, 2023",
      amount: "$15,000.00",
      status: "paid",
      paymentMethod: "Credit Card",
    },
    {
      id: "4",
      number: "INV-2023-002",
      issuedDate: "March 15, 2023",
      paidDate: "March 30, 2023",
      amount: "$22,750.00",
      status: "paid",
      paymentMethod: "Bank Transfer",
    },
  ]

  const getStatusBadge = (status) => {
    if (status === "due") return "text-orange-600 bg-orange-50"
    if (status === "overdue") return "text-red-600 bg-red-50"
    return "text-teal-600 bg-teal-50"
  }

  const getStatusLabel = (invoice) => {
    if (invoice.status === "due") return "Due"
    if (invoice.status === "overdue") return "Overdue"
    return "Paid"
  }

  const getDaysLeft = (invoice) => {
    if (invoice.status === "due") return "15 days left"
    if (invoice.status === "overdue") return "10 days overdue"
    return ""
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 md:px-6 md:py-6">
          <button className="flex items-center gap-2 text-orange-600 font-medium mb-3 hover:opacity-80 text-sm md:text-base">
            <IoArrowBack className="w-4 h-4 md:w-5 md:h-5" />
            Back to Project details
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-1">Duplex at Lekki</h1>
          <p className="text-xs md:text-base text-gray-500">Billing & Payments</p>
        </div>
      </div>

      {/* Payment Due Section */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 md:px-6">
        <div className="bg-orange-50 border-l-4 border-orange-600 rounded-lg p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-600 text-white">
                  <MdPayment className="w-4 h-4 md:w-6 md:h-6" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-sm md:text-lg font-bold text-gray-900 mb-3 md:mb-0">Payment Due (1 Invoice)</h2>
                <div className="hidden md:block">
                  <p className="text-gray-900 font-semibold mb-1 text-sm">Invoice #INV-2023-005</p>
                  <div className="flex gap-6 text-xs md:text-sm text-gray-600">
                    <span className="flex items-center gap-2">📅 Issued: June 25, 2023</span>
                    <span className="flex items-center gap-2">📅 Due: July 10, 2023</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto md:text-right">
              <div className="hidden md:block mb-4">
                <p className="text-gray-600 text-sm mb-1">Total Amount</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">$12,500.00</p>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-lg transition text-sm md:text-base">
                💳 Pay Now
              </button>
            </div>
          </div>

          {/* Mobile layout for payment due */}
          <div className="md:hidden mt-3">
            <p className="text-gray-900 font-semibold mb-2 text-sm">Invoice #INV-2023-005</p>
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Issued: June 25, 2023</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Due: July 10, 2023</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">Total Amount</p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">$12,500.00</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4 mb-6 md:mb-8 md:items-center md:justify-between">
          <div className="relative flex-1 md:flex-initial md:w-64">
            <IoSearch className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100">
            <IoFilter className="w-4 h-4 md:w-5 md:h-5" />
            Filter Options
          </button>
        </div>

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
            <span className="inline-block">Invoices</span>
            <span className="inline-block ml-2 px-2 py-0.5 md:py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
              5
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
              4
            </span>
          </button>
        </div>

        {/* Current Invoices */}
        <div className="mb-10 md:mb-12">
          <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Current Invoices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {currentInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">{invoice.number}</h4>
                  <span
                    className={`text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full ${getStatusBadge(invoice.status)}`}
                  >
                    {getStatusLabel(invoice)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Issued Date</p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{invoice.issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 md:mb-1">
                      {invoice.status === "paid" ? "Paid Date" : "Due Date"}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">
                      {invoice.status === "paid" ? invoice.paidDate : invoice.dueDate}
                    </p>
                  </div>
                </div>

                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Amount</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{invoice.amount}</p>
                  <p className="text-xs text-gray-600">
                    Status:{" "}
                    {invoice.status === "due"
                      ? "15 days left"
                      : invoice.status === "overdue"
                        ? "10 days overdue"
                        : "Completed"}
                  </p>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50">
                    <IoDownload className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-1.5 md:py-2 px-3 md:px-4 rounded-lg transition text-xs md:text-sm">
                    💳 Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Invoices */}
        <div>
          <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Past Invoices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {pastInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">{invoice.number}</h4>
                  <span
                    className={`text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full ${getStatusBadge(invoice.status)}`}
                  >
                    {getStatusLabel(invoice)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Issued Date</p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{invoice.issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Paid Date</p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base">{invoice.paidDate}</p>
                  </div>
                </div>

                <div className="mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
                  <p className="text-xs text-gray-500 mb-0.5 md:mb-1">Amount</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">{invoice.amount}</p>
                  <p className="text-xs text-gray-600">Payment Method: {invoice.paymentMethod}</p>
                </div>

                <div className="flex gap-2 md:gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50">
                    <IoDownload className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-xs md:text-sm hover:bg-gray-50">
                    📋 View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
