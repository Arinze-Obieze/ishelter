"use client"

import { useState } from "react"
import {
  IoNotificationsOutline,
  IoChevronBack,
  IoEllipsisVertical,
  IoCheckmarkCircle,
  IoAlertCircle,
  IoDocumentTextOutline,
  IoChatbubbleOutline,
  IoDocumentOutline,
  IoCalendarOutline,
  IoArrowForward,
} from "react-icons/io5"
import { MdDashboard, MdDescription, MdPayment } from "react-icons/md"
import { FaVideo } from "react-icons/fa"

export default function ProjectDetails() {
  const [expandedPhases, setExpandedPhases] = useState({
    sitePrep: true,
    foundation: true,
  })

  const togglePhase = (phase) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phase]: !prev[phase],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
   
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button & Title */}
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <IoChevronBack />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold flex-1 text-center sm:text-left sm:ml-4">Duplex at Lekki</h1>
          <button className="p-2 hover:bg-gray-100 rounded">
            <IoEllipsisVertical className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress & Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Progress Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#f97316"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.65)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-orange-500">65%</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-gray-900">Overall Completion</p>
                </div>

                {/* Project Status */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Project Status</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current Phase</p>
                      <p className="font-semibold text-gray-900">Foundation Work</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Started On</p>
                      <p className="font-semibold text-gray-900">March 15, 2023</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">November 30, 2023</p>
                    <div className="bg-green-50 text-green-700 px-3 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium">
                      <IoCheckmarkCircle />
                      <span>On Schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Required Banner */}
            <div className="bg-yellow-50 border-l-4 border-orange-500 p-4 rounded-lg flex items-start gap-3">
              <IoAlertCircle className="text-orange-500 text-2xl flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Action Required</h3>
                <p className="text-sm text-gray-700">Please approve the updated architectural plan by June 15, 2023</p>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 whitespace-nowrap">
                Approve Plan
              </button>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Timeline</h2>

              <div className="space-y-4">
                {/* Consultation Session */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <IoCheckmarkCircle className="text-white text-sm" />
                    </div>
                    <div className="w-0.5 h-full bg-orange-500 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Consultation Session</h3>
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-1 font-medium">
                          Complete
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">March 15 - April 10, 2023</p>
                        <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Planning & Design */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <IoCheckmarkCircle className="text-white text-sm" />
                    </div>
                    <div className="w-0.5 h-full bg-orange-500 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Project Planning & Design</h3>
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-1 font-medium">
                          Complete
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">September 15 - November 30, 2023</p>
                        <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Site Preparation */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <IoCheckmarkCircle className="text-white text-sm" />
                    </div>
                    <div className="w-0.5 h-full bg-orange-500 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Site Preparation</h3>
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded mt-1 font-medium">
                            Complete
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">April 28 - June 20, 2023</p>
                          <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 mt-4">
                        {[
                          "Blinding and base",
                          "1.7m total height, raft foundation",
                          "Filling",
                          "Plumbing air conditioning and electrical works conduit pipe",
                          "Ground floor slab",
                          "Block settings",
                          "Beams, columns, and lintels",
                          "First floor Slab",
                          "Parapet wall",
                          "Roof carcass",
                          "Roof slab",
                          "Roof covering",
                          "Plastering (external only)",
                          "Screeding (external only)",
                          "Fencing",
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <IoCheckmarkCircle className="text-green-600 text-lg flex-shrink-0" />
                            <span className="text-sm text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Budget Info */}
                      <div className="mt-4 pt-4 border-t border-green-200 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Total Budget</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Spent to Date</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Remaining</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Foundation Work */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-4 border-orange-500 bg-white rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">Foundation Work</h3>
                          <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded mt-1 font-medium">
                            In Progress
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">April 28 - June 20, 2023</p>
                          <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 mt-4">
                        {[
                          { text: "Blinding and base", status: "complete" },
                          { text: "1.7m total height, raft foundation", status: "complete" },
                          { text: "Filling", status: "complete" },
                          { text: "Plumbing air conditioning and electrical works conduit pipe", status: "complete" },
                          { text: "Ground floor slab", status: "complete" },
                          { text: "Block settings", status: "complete" },
                          { text: "Beams, columns, and lintels", status: "complete" },
                          { text: "First floor Slab", status: "complete" },
                          { text: "Parapet wall", status: "complete" },
                          { text: "Roof carcass", status: "complete" },
                          { text: "Roof slab", status: "complete" },
                          { text: "Roof covering", status: "complete" },
                          { text: "Plastering (external only)", status: "complete" },
                          { text: "Screeding (external only)", status: "complete" },
                          { text: "Fencing", status: "pending" },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            {item.status === "complete" ? (
                              <IoCheckmarkCircle className="text-orange-600 text-lg flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-orange-300 rounded-full flex-shrink-0"></div>
                            )}
                            <span
                              className={`text-sm ${item.status === "complete" ? "text-gray-700" : "text-gray-500"}`}
                            >
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Budget Info */}
                      <div className="mt-4 pt-4 border-t border-orange-200 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Total Budget</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Spent to Date</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-900">Remaining</span>
                          <span className="font-semibold text-gray-900">₦500,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Framing & Structural Work */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 bg-white rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Framing & Structural Work</h3>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1 font-medium">
                          Upcoming
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">December 7 - May 13, 2024</p>
                        <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interior & Finishing */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-gray-300 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">Interior & Finishing</h3>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1 font-medium">
                          Upcoming
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">June 4 - November 10, 2024</p>
                        <button className="text-teal-600 text-sm font-medium hover:underline">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Construction Feed */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Live Construction Feed</h2>
                <button className="flex items-center gap-2 text-orange-500 border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-50 font-medium">
                  <FaVideo />
                  <span>Live Feed</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Feed Item 1 */}
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  <img
                    src="/concrete-pouring.png"
                    alt="Construction update"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Foundation Concrete Pouring</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Successfully completed pouring concrete for the north side foundation. Curing process has begun
                      and will take approximately 7 days.
                    </p>
                    <p className="text-xs text-gray-400">May 28, 2023 - 3:45 PM</p>
                  </div>
                </div>

                {/* Feed Item 2 */}
                <div className="flex gap-4 pb-4 border-b border-gray-200">
                  <img
                    src="/rebar-installation-construction.jpg"
                    alt="Construction update"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Rebar Installation Complete</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Finished installing all reinforcement bars according to structural engineer specifications. Ready
                      for concrete pouring next week.
                    </p>
                    <p className="text-xs text-gray-400">May 26, 2023 - 11:20 AM</p>
                  </div>
                </div>

                {/* Feed Item 3 */}
                <div className="flex gap-4">
                  <img
                    src="/excavation-construction-site.jpg"
                    alt="Construction update"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">Foundation Excavation Started</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Began excavation work for the building foundation. Soil conditions are good and matching
                      geotechnical report expectations.
                    </p>
                    <p className="text-xs text-gray-400">May 22, 2023 - 9:15 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Budget Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoDocumentTextOutline className="text-orange-500 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Budget</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Budget</span>
                  <span className="font-semibold text-gray-900">₦75,000,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600">Spent to Date</span>
                  <span className="font-semibold text-gray-900">₦56,250,000</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-semibold text-gray-900">₦18,750,000</span>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  View Financial Details
                  <IoArrowForward className="text-xs" />
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoCalendarOutline className="text-orange-500 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Rebar inspection by local authority</p>
                    <p className="text-xs text-gray-400">June 12, 2023</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Final foundation concrete pour</p>
                    <p className="text-xs text-gray-400">June 15, 2023</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-900 font-medium">Foundation waterproofing application</p>
                    <p className="text-xs text-gray-400">June 25, 2023</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <IoDocumentOutline className="text-orange-500 text-xl" />
                <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="text-orange-500 text-2xl" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">Documents</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IoChatbubbleOutline className="text-orange-500 text-2xl" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">Chat</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IoDocumentTextOutline className="text-orange-500 text-2xl" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">Invoices</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-yellow-50 border-t border-yellow-100 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600">© 2023 iSHELTER, a product of Everything Shelter</p>
        </div>
      </footer>
    </div>
  )
}
