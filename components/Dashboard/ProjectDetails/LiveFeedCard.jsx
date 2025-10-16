import React from 'react'
import { FaVideo } from 'react-icons/fa'

const LiveFeed = () => {
  return (
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
  )
}

export default LiveFeed
