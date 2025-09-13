import {
    FiMoreVertical,
    FiCalendar,
    FiDollarSign,
    FiFileText,
    FiCheckCircle,
    FiCircle,
    FiAlertTriangle,
    FiClock,
  } from "react-icons/fi"
  
  export default function Dashboard() {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">DUPLEX DEVELOPMENT</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Duplex at Lebel</h1>
            <FiMoreVertical className="w-5 h-5 text-gray-600" />
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress and Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Progress Circle */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#f97316"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${63 * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-orange-500">63%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-gray-900">Social Completion</p>
                  </div>
                </div>
  
                {/* Project Status */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Project Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Presentation Work</span>
                      <span className="text-sm text-gray-900">March 16, 2023</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Foundation Work</span>
                      <span className="text-sm text-gray-900">November 24, 2023</span>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">On Schedule</span>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Action Required Banner */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Action Required</p>
                    <p className="text-xs text-yellow-700">Review all requirements and sign the form by Oct 15, 2023</p>
                  </div>
                </div>
                <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
                  View Details
                </button>
              </div>
  
              {/* Project Timeline */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
                  <span className="text-sm text-gray-500">6 Budget</span>
                </div>
  
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Project Planning & Design</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <span className="text-sm text-gray-600">$15,000.00</span>
                  </div>
  
                  <div className="flex items-center gap-4">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Site Preparation</p>
                      <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <span className="text-sm text-gray-600">$8,500.00</span>
                  </div>
  
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-orange-500"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Foundation Work</p>
                      <p className="text-xs text-orange-600">In Progress</p>
                    </div>
                    <span className="text-sm text-gray-600">$25,000.00</span>
                  </div>
  
                  <div className="flex items-center gap-4">
                    <FiCircle className="w-5 h-5 text-gray-300" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Framing & Structural Work</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                    <span className="text-sm text-gray-400">$35,000.00</span>
                  </div>
  
                  <div className="flex items-center gap-4">
                    <FiCircle className="w-5 h-5 text-gray-300" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">Interior & Finishing</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                    <span className="text-sm text-gray-400">$45,000.00</span>
                  </div>
                </div>
              </div>
  
              {/* Live Construction Feed */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Construction Feed</h3>
  
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <img
                      src="/foundation-concrete-pouring.jpg"
                      alt="Foundation work"
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Foundation Concrete Pouring</p>
                      <p className="text-xs text-gray-500">
                        Foundation concrete work for the building foundation. All reinforcement steel and all formwork are
                        in place.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
  
                  <div className="flex gap-4">
                    <img
                      src="/basic-installation-completion.jpg"
                      alt="Installation work"
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Basic Installation Completion</p>
                      <p className="text-xs text-gray-500">
                        Basic installation work completed for the building foundation. All reinforcement steel and all
                        formwork are in place.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                    </div>
                  </div>
  
                  <div className="flex gap-4">
                    <img
                      src="/foundation-excavation-started.jpg"
                      alt="Excavation work"
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Foundation Excavation Started</p>
                      <p className="text-xs text-gray-500">
                        Foundation excavation work for the building foundation. All reinforcement steel and all formwork
                        are in place.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Right Column */}
            <div className="space-y-6">
              {/* Budget Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Budget</span>
                    <span className="text-sm font-medium text-gray-900">$128,500.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="text-sm font-medium text-gray-900">$48,500.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-sm font-medium text-green-600">$80,000.00</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "38%" }}></div>
                  </div>
                </div>
              </div>
  
              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FiClock className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Final inspection scheduled for next week</p>
                      <p className="text-xs text-gray-500">Due in 3 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiClock className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sign required documents before next phase</p>
                      <p className="text-xs text-gray-500">Due in 5 days</p>
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Quick Access */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50">
                    <FiFileText className="w-6 h-6 text-orange-500" />
                    <span className="text-xs text-gray-600">Documents</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50">
                    <FiDollarSign className="w-6 h-6 text-orange-500" />
                    <span className="text-xs text-gray-600">Payments</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50">
                    <FiCalendar className="w-6 h-6 text-orange-500" />
                    <span className="text-xs text-gray-600">Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  