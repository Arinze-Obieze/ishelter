'use client'

import { Filter } from "lucide-react"
import { useDocuments } from "@/contexts/DocumentsContext"

export function DocumentsStats() {
  const { projectDocuments, loading } = useDocuments();

  // Calculate totals
  const totalNewDocuments = Object.values(projectDocuments).reduce((acc, project) => 
    acc + (project?.newCount || 0), 0);
  const totalDocuments = Object.values(projectDocuments).reduce((acc, project) => 
    acc + (project?.totalCount || 0), 0);
  const projectsNeedingApproval = Object.values(projectDocuments).filter(project => 
    (project?.pendingApproval?.length || 0) > 0).length;

  if (loading) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-10">
      <div className="p-4 md:p-6 bg-white shadow-sm rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-0">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 md:mb-4">
            <span className="md:hidden">Documents</span>
            <span className="hidden md:inline">Project Documents</span>
          </h2>
          <button className="flex md:hidden items-center px-3 py-1.5 text-sm text-gray-600 bg-transparent border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Content */}
        <div className="md:flex md:items-center md:justify-between">
          {/* Action Required Section */}
          <div className="flex items-start gap-3 md:flex-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Action Required</h3>
              <p className="text-sm text-gray-600">
                {projectsNeedingApproval} projects have documents pending your approval
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex items-center gap-4 md:gap-8 mt-4 md:mt-0 md:ml-8">
            <div className="text-center flex-1 md:flex-none">
              <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">{totalNewDocuments}</div>
              <div className="text-xs md:text-sm text-gray-600">
                <span className="md:hidden">New Documents</span>
                <span className="hidden md:inline">New Documents This Week</span>
              </div>
            </div>
            <div className="text-center flex-1 md:flex-none">
              <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-1">{totalDocuments}</div>
              <div className="text-xs md:text-sm text-gray-600">Total Documents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}