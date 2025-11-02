"use client"

import { useState } from "react"
import { IoMdDocument } from "react-icons/io"

import { IoWarning } from "react-icons/io5"
import { MdAttachMoney, MdCalendarToday, MdCheckCircle, MdFilterList, MdHistory, MdLocationOn, MdWarning } from "react-icons/md"

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("all")

  const projects = [
    {
      id: 1,
      name: "Duplex at Lekki",
      location: "Lekki Phase 1, Lagos",
      status: "action",
      statusText: "Action Required",
      paymentDue: "$12,500.00",
      dueDate: "July 10, 2023",
      lastPayment: "June 5, 2023",
    },
    {
      id: 2,
      name: "Sunset Apartments",
      location: "Victoria Island, Lagos",
      status: "upcoming",
      statusText: "Payment Upcoming",
      paymentDue: "$8,750.00",
      dueDate: "July 22, 2023",
      lastPayment: "May 20, 2023",
    },
    {
      id: 3,
      name: "Tech Park Offices",
      location: "Ikeja, Lagos",
      status: "clear",
      statusText: "All Clear",
      paymentDue: "$15,000.00",
      dueDate: "Aug 15, 2023",
      lastPayment: "June 15, 2023",
    },
    {
      id: 4,
      name: "Marina Retail Center",
      location: "Lagos",
      status: "empty",
      statusText: "No Invoices",
      paymentDue: "-",
      dueDate: "-",
      lastPayment: "Project Started June 25, 2023",
    },
  ]

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

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Billing & Payments</h1>
          <p className="text-gray-500">Manage all your project payments in one place</p>
        </div>

        {/* Alert Banner */}
        <div className="bg-primary text-white rounded-lg p-4 md:p-6 mb-8 flex items-start gap-4">
          <MdWarning className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-lg mb-1">Payment Attention Required</h2>
            <p className="text-orange-100">2 projects have outstanding payments that need your attention</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">TOTAL OUTSTANDING</p>
            <p className="text-3xl md:text-4xl font-bold text-primary">$21,250.00</p>
          </div>
          <div className="bg-white rounded-lg p-6 md:p-8 border border-gray-200">
            <p className="text-gray-500 text-sm mb-2">NEXT PAYMENT DUE</p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900">July 10</p>
          </div>
        </div>

        {/* Your Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
            <button className="flex items-center gap-2 text-primary font-semibold hover:text-orange-600">
              <MdFilterList className="w-5 h-5" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>

          {/* Tabs */}
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Project Header */}
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

                {/* Project Details */}
                {project.status !== "empty" ? (
                  <div className="divide-y divide-gray-200">
                    {/* Payment Due */}
                    <div className="p-4 md:p-6 flex items-center justify-between bg-orange-50">
                      <div className="flex items-center gap-3">
                        <MdAttachMoney className="w-6 h-6 text-primary flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Payment Due</span>
                      </div>
                      <span className="text-lg md:text-xl font-bold text-primary">{project.paymentDue}</span>
                    </div>

                    {/* Due Date */}
                    <div className="p-4 md:p-6 flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-3">
                        <MdCalendarToday className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Due Date</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{project.dueDate}</span>
                    </div>

                    {/* Last Payment */}
                    <div className="p-4 md:p-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MdHistory className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">Last Payment</span>
                      </div>
                      <span className="text-gray-900 font-semibold">{project.lastPayment}</span>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 md:p-6 pt-6">
                      <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                        <IoMdDocument className="w-5 h-5" />
                        {project.id === 3 ? "View Details" : "View Billing"}
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
        </div>
      </div>
    </main>
  )
}
