import { FiArrowLeft } from "react-icons/fi"
import Link from "next/link"

export default function Header({ projectData }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/dashboard/live-feed"
              className="flex items-center gap-2 text-primary hover:text-orange-700 mb-3 lg:hidden"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Projects</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData?.projectName || "Project Details"}
            </h1>
            {projectData?.projectAddress && (
              <p className="text-gray-600 mt-1">{projectData.projectAddress}</p>
            )}
            <p className="text-gray-500 mt-1 text-sm">Live Construction Feed</p>
          </div>
          <Link 
            href="/dashboard/live-feed"
            className="text-primary hover:text-orange-700 font-medium text-sm hidden lg:flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    </div>
  )
}