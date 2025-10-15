"use client"

import { useState } from "react"
import { FiEdit2, FiTrash2, FiEye, FiChevronRight, FiChevronDown, FiPlus } from "react-icons/fi"

export default function TaskTab() {
  const [expandedTasks, setExpandedTasks] = useState(["site-prep"])
  const [activeTab, setActiveTab] = useState("bills")
  const [activeMobileTab, setActiveMobileTab] = useState("tasks")

  const toggleTask = (taskId) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const tasks = [
    {
      id: "site-prep",
      name: "Site Preparation",
      assignee: "Multiple",
      status: "Ongoing",
      dueDate: "Dec 15 - Jan 30",
      cost: "₦8,800,000",
      hasSubtasks: true,
      subtasks: [
        {
          id: "survey",
          name: "Site Survey & Soil Testing",
          status: "Completed",
          dueDate: "Dec 20, 2024",
          cost: "₦1,200,000",
        },
        {
          id: "clearance",
          name: "Site Clearance & Leveling",
          status: "Ongoing",
          dueDate: "Jan 10, 2025",
          cost: "₦3,500,000",
        },
        {
          id: "set-out",
          name: "Set Out for Foundation",
          status: "Pending",
          dueDate: "Jan 25, 2025",
          cost: "₦800,000",
        },
      ],
    },
    {
      id: "foundation",
      name: "Foundation Work",
      assignee: "Multiple",
      status: "Pending",
      dueDate: "Feb 1 - Mar 15",
      cost: "₦17,200,000",
      hasSubtasks: true,
      subtasks: [],
    },
    {
      id: "structural",
      name: "Structural Work",
      assignee: "Multiple",
      status: "Pending",
      dueDate: "Mar 20 - Jun 30",
      cost: "₦19,400,000",
      hasSubtasks: true,
      subtasks: [],
    },
  ]

  const teamMembers = [
    { name: "John Adebayo", role: "Project Manager", initials: "JA" },
    { name: "Sarah Okafor", role: "Senior Architect", initials: "SO" },
    { name: "Mike Johnson", role: "Construction Manager", initials: "MJ" },
    { name: "Amara Nwosu", role: "Site Engineer", initials: "AN" },
    { name: "David Okonkwo", role: "Quantity Surveyor", initials: "DO" },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Ongoing":
        return "bg-yellow-100 text-yellow-700"
      case "Completed":
        return "bg-green-100 text-green-700"
      case "Pending":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Mobile Tabs */}
        <div className="bg-white border-b border-gray-200 flex">
          <button
            onClick={() => setActiveMobileTab("overview")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "overview" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveMobileTab("documents")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "documents" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveMobileTab("tasks")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeMobileTab === "tasks" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-500"
            }`}
          >
            Tasks & Team
          </button>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Cost Summary Card */}
          <div className="bg-orange-500 rounded-lg p-4 mb-4 text-white">
            <h2 className="text-sm font-medium mb-3">Cost Reconciliation Summary</h2>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-xl font-bold">₦45.2M</div>
                <div className="text-xs opacity-90">Total Budget</div>
              </div>
              <div>
                <div className="text-xl font-bold">₦38.7M</div>
                <div className="text-xs opacity-90">Cost Incurred</div>
              </div>
              <div>
                <div className="text-xl font-bold">₦6.5M</div>
                <div className="text-xs opacity-90">Remaining</div>
              </div>
            </div>
          </div>

          {/* Project Timeline Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h3 className="text-base font-bold mb-3">Project Timeline & Cost Management</h3>
            <div className="flex gap-2 mb-4">
              <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded text-sm">
                <FiPlus size={14} />
                Add Stage
              </button>
              <button className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium">
                <FiPlus size={14} />
                Add Task
              </button>
            </div>

            {/* Task Management */}
            <h4 className="text-sm font-semibold mb-3">Task Management</h4>

            {/* Site Preparation Task */}
            <div className="border border-gray-200 rounded-lg mb-3">
              <div className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <button onClick={() => toggleTask("site-prep")} className="mt-1">
                    {expandedTasks.includes("site-prep") ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                  </button>
                  <div className="flex-1">
                    <div className="font-medium text-sm mb-1">Site Preparation</div>
                    <div className="text-xs text-gray-500 mb-2">Multiple</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Ongoing</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Due Date</div>
                    <div className="text-xs mb-2">Dec 15 - Jan 30</div>
                    <div className="text-orange-500 font-semibold text-sm">₦8,800,000</div>
                  </div>
                </div>

                {/* Subtasks */}
                {expandedTasks.includes("site-prep") && (
                  <div className="ml-6 mt-3 space-y-3">
                    <div className="border-l-2 border-gray-200 pl-3">
                      <div className="font-medium text-sm mb-1">Site Survey & Soil Testing</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completed</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Due Date</div>
                      <div className="text-xs mb-2">Dec 20, 2024</div>
                      <div className="text-orange-500 font-semibold text-sm mb-2">₦1,200,000</div>
                      <div className="flex gap-2">
                        <button className="p-1.5 border border-gray-300 rounded">
                          <FiEye size={14} />
                        </button>
                        <button className="p-1.5 border border-gray-300 rounded">
                          <FiEdit2 size={14} />
                        </button>
                        <button className="p-1.5 border border-gray-300 rounded">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex lg:flex-[3]">
      <div className="flex-2">
          {/* Cost Summary Header */}
          <div className="bg-orange-500 text-white p-6 mx-6 mt-6 rounded-lg">
          <h2 className="text-sm font-medium mb-4">Cost Reconciliation Summary</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold mb-1">₦45.2M</div>
              <div className="text-sm opacity-90">Total Budget</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">₦38.7M</div>
              <div className="text-sm opacity-90">Cost Incurred</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">₦6.5M</div>
              <div className="text-sm opacity-90">Remaining</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 mx-6 mt-4">
          <div className="flex gap-6 px-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 text-sm font-medium ${
                activeTab === "overview" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`py-3 text-sm font-medium ${
                activeTab === "timeline" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"
              }`}
            >
              Task Timeline
            </button>
            <button
              onClick={() => setActiveTab("feed")}
              className={`py-3 text-sm font-medium ${
                activeTab === "feed" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"
              }`}
            >
              Live Feed & Updates
            </button>
            <button
              onClick={() => setActiveTab("bills")}
              className={`py-3 px-4 text-sm font-medium ${
                activeTab === "bills" ? "text-white bg-orange-500 rounded-t-lg" : "text-gray-600"
              }`}
            >
              Bills & Invoices
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`py-3 text-sm font-medium ${
                activeTab === "documents" ? "text-orange-500 border-b-2 border-orange-500" : "text-gray-600"
              }`}
            >
              Documents
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6 mx-6 mt-6">
          {/* Left Content */}
          <div className="flex-1 bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Project Timeline & Cost Management</h3>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm">
                  <FiPlus size={16} />
                  Add New Stage
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium">
                  <FiPlus size={16} />
                  Add New Task
                </button>
              </div>
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Task Name</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Assignee</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Status</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Due Date</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Cost (NGN)</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <>
                      <tr key={task.id} className="border-b border-gray-100">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {task.hasSubtasks && (
                              <button onClick={() => toggleTask(task.id)}>
                                {expandedTasks.includes(task.id) ? (
                                  <FiChevronDown size={16} />
                                ) : (
                                  <FiChevronRight size={16} />
                                )}
                              </button>
                            )}
                            <span className="text-sm font-medium">{task.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.assignee}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-600">{task.dueDate}</td>
                        <td className="py-3 px-2 text-sm font-semibold text-orange-500">{task.cost}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <FiEye size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <FiEdit2 size={16} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <FiTrash2 size={16} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedTasks.includes(task.id) &&
                        task.subtasks.map((subtask) => (
                          <tr key={subtask.id} className="border-b border-gray-100 bg-gray-50">
                            <td className="py-3 px-2 pl-12">
                              <span className="text-sm text-gray-700">{subtask.name}</span>
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">-</td>
                            <td className="py-3 px-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(subtask.status)}`}
                              >
                                {subtask.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">{subtask.dueDate}</td>
                            <td className="py-3 px-2 text-sm font-semibold text-orange-500">{subtask.cost}</td>
                            <td className="py-3 px-2">
                              <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <FiEye size={16} className="text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <FiEdit2 size={16} className="text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <FiTrash2 size={16} className="text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

      </div>

        
        </div>
          {/* Right Sidebar - Project Team */}
          <div className="w-80 bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Project Team</h3>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <FiPlus size={18} />
                </button>
                <button className="p-1.5 hover:bg-gray-100 rounded">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  <button className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    i
                  </button>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}
