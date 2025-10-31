import { MdLocationOn, MdVideoCall } from "react-icons/md"
import Image from "next/image"

export default function ProjectCard({ project }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Project Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 md:h-56">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title and Update Badge */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
          {project.updateCount > 0 && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-whi1e font-semibold text-sm flex-shrink-0">
              {project.updateCount}
            </div>
          )}
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center gap-2 text-gray-500">
          <MdLocationOn className="h-4 w-4" />
          <span className="text-sm">{project.location}</span>
        </div>

        {/* Progress Bar - Only show if not coming soon */}
        {!project.isComingSoon && (
          <div className="mb-4">
            <div className="mb-1 text-xs text-gray-500">Project Progress</div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full bg-primary transiti1n-all" style={{ width: `${project.progress}%` }}></div>
            </div>
            <div className="mt-1 text-right text-xs text-gray-500">{project.progress}%</div>
          </div>
        )}

        {/* Status Badge - Only for coming soon */}
        {project.isComingSoon && (
          <div className="mb-4">
            <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-500">
              Updates coming soon
            </span>
          </div>
        )}

        {/* Description and Timestamp */}
        <p className="mb-3 text-sm text-gray-600">{project.description}</p>
        <div className="mb-5 flex items-center gap-2 text-xs text-gray-500">
          <span>📅</span>
          <span>{project.timestamp}</span>
        </div>

        {/* Button */}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600">
          <MdVideoCall className="h-5 w-5" />
          {project.button}
        </button>
      </div>
    </div>
  )
}
