'use client'
import { FiMapPin, FiFileText } from "react-icons/fi"
import { useDocuments } from "@/contexts/DocumentsContext"
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext"

export default function Cards() {
  const { projects } = usePersonalProjects();
  const { projectDocuments, loading } = useDocuments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mb-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project) => (
            <PropertyCard 
              key={project.id} 
              property={{
                id: project.id,
                title: project.projectName,
                location: project.shortDescription,
                image: "/home-placeholder.jpg",
                stats: [
                  { 
                    label: "Pending Approval", 
                    value: projectDocuments[project.id]?.pendingApproval.length || "0" 
                  },
                  { 
                    label: "New Files", 
                    value: projectDocuments[project.id]?.newCount || "0" 
                  },
                  { 
                    label: "Total Files", 
                    value: projectDocuments[project.id]?.totalCount || "0" 
                  },
                ],
                hasDocuments: Boolean(projectDocuments[project.id]?.documents.length),
                hasNotification: Boolean(projectDocuments[project.id]?.pendingApproval.length)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }) {
  const { title, location, image, stats, hasDocuments, hasNotification } = property

  if (!hasDocuments) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-5">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiFileText className="w-16 h-16 mx-auto mb-4" />
            <div className="text-sm">No image available</div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="text-center py-8 text-gray-500">
            <p className="text-sm mb-2">No documents have been uploaded</p>
            <p className="text-sm mb-4">for this project yet.</p>
            <button className="bg-gray-300 text-gray-600 px-6 py-2 rounded text-sm font-medium cursor-not-allowed">
              Documents coming soon
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative h-48">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        {hasNotification && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        {location && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <FiMapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        <button className="w-full cursor-pointer bg-primary hover:bg-orange-600 text-white py-2 px-4 rounded font-medium text-sm flex items-center justify-center gap-2 transition-colors">
          <FiFileText className="w-4 h-4" />
          View Documents
        </button>
      </div>
    </div>
  )
}
