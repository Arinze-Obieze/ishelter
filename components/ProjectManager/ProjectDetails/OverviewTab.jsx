import React from 'react'
import {
  FaHome,
  FaUsers,
  FaRss,
  FaFileAlt,
  FaDollarSign,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaPencilAlt,
  FaComments,
} from "react-icons/fa"
import TabsNavigation from './TabsNavigation'


const OverviewTab = ({ projectId, tabs, activeTab, onTabChange }) => {
  const projectPhases = [
    { name: "Foundation", status: "Completed" },
    { name: "Framing", status: "Completed" },
    { name: "Electrical", status: "In Progress" },
    { name: "Interior", status: "Pending" },
    { name: "Final", status: "Pending" },
  ]
  return (
    <div className='md:px-8'>
    <header className="py-4">
              <div className="bg-white px-4 py-4 md:pt-13 md:pb-5 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
               
                {/* Title and Badge */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 ">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 max-md:text-center">Riverside Community Center</h1>
                  <span className="bg-orange-500 max-md:mx-auto text-white text-xs font-semibold px-3 py-1 rounded-full w-fit">
                    In Progress
                  </span>
                </div>
      
                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-3 [&>*]:cursor-pointer">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors">
                    <FaFileInvoiceDollar className="text-sm" />
                    Generate Invoice
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-md border border-gray-300 flex items-center justify-center gap-2 transition-colors">
                    <FaPencilAlt className="text-sm" />
                    Log Update
                  </button>
                </div>
              </div>
            </header>
            <TabsNavigation tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
           <div className='bg-white'>
                    {/* Main Content */}
                        <main className="px-4 md:px-5 py-6 md:py-8">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Column */}
                            <div className="flex-1">
                              {/* Stats Cards */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                                {/* Days Remaining */}
                                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">42</div>
                                  <div className="text-sm text-gray-600 font-medium">Days Remaining</div>
                                </div>
                  
                                {/* Budget Spent */}
                                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                                  <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">68%</div>
                                  <div className="text-sm text-gray-600 font-medium">Budget Spent</div>
                                </div>
                  
                                {/* Open Tasks */}
                                <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">7</div>
                                  <div className="text-sm text-gray-600 font-medium">Open Tasks</div>
                                </div>
                              </div>
                  
                              {/* Project Progress */}
                              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Project Progress</h2>
                  
                                {/* Progress Bar */}
                                <div className="mb-6">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "68%" }}></div>
                                  </div>
                                </div>
                  
                                {/* Timeline Info */}
                                <div className="flex flex-col md:flex-row md:justify-between text-sm text-gray-600 mb-6 gap-2">
                                  <div>
                                    <span className="font-medium">Started:</span> Jan 15, 2024
                                  </div>
                                  <div className="font-semibold text-gray-900">68% Complete</div>
                                  <div>
                                    <span className="font-medium">Due:</span> May 30, 2024
                                  </div>
                                </div>
                  
                                {/* Project Phases */}
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-2">
                                  {projectPhases.map((phase, index) => (
                                    <div key={index} className="flex md:flex-col items-center md:items-center gap-3 md:gap-2">
                                      <div
                                        className={`w-3 h-3 rounded-full ${
                                          phase.status === "Completed"
                                            ? "bg-orange-500"
                                            : phase.status === "In Progress"
                                              ? "bg-orange-500"
                                              : "bg-gray-300"
                                        }`}
                                      ></div>
                                      <div className="text-center">
                                        <div className="font-semibold text-gray-900 text-sm">{phase.name}</div>
                                        <div
                                          className={`text-xs ${
                                            phase.status === "Completed"
                                              ? "text-gray-500"
                                              : phase.status === "In Progress"
                                                ? "text-orange-500"
                                                : "text-gray-400"
                                          }`}
                                        >
                                          {phase.status}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                  
                            {/* Right Column - Client Contact */}
                            <div className="lg:w-80">
                              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Client Contact</h2>
                  
                                <div className="mb-4">
                                  <div className="font-semibold text-gray-900 mb-1">Sarah Johnson</div>
                                  <div className="text-sm text-gray-600">Riverside Parks & Recreation</div>
                                </div>
                  
                                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2.5 rounded-md flex items-center justify-center gap-2 transition-colors">
                                  <FaComments className="text-base" />
                                  Start Chat
                                </button>
                              </div>
                            </div>
                          </div>
                        </main>
           </div>
    </div>
  )
}

export default OverviewTab
