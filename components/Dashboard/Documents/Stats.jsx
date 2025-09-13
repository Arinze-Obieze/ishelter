import { Filter } from "lucide-react"

export function DocumentsStats() {
  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Documents</h2>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Action Required</h3>
                  <p className="text-sm text-gray-600">5 projects have documents pending your approval</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 ml-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">5</div>
                <div className="text-sm text-gray-600">New Documents This Week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-1">24</div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
            <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Action Required</h3>
                <p className="text-sm text-gray-600">5 projects have documents pending your approval</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">5</div>
                <div className="text-xs text-gray-600">New Documents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">24</div>
                <div className="text-xs text-gray-600">Total Documents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
