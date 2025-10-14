"use client";

import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext";
import Link from "next/link";

export default function Projects() {
  const { projects, loading, error } = usePersonalProjects();

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('progress') || statusLower.includes('active')) {
      return "bg-blue-100 text-blue-600";
    } else if (statusLower.includes('completed') || statusLower.includes('done')) {
      return "bg-green-100 text-green-600";
    } else if (statusLower.includes('pending') || statusLower.includes('awaiting')) {
      return "bg-pink-100 text-pink-600";
    } else {
      return "bg-gray-100 text-gray-600";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to calculate completion (placeholder logic)
  const getCompletion = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('completed')) return 100;
    if (statusLower.includes('progress')) return 1;
    if (statusLower.includes('planning')) return 10;
    return 25;
  };

  // Placeholder image
  const placeholderImage = "/home-placeholder.jpg";

  if (loading) {
    return (
      <div className="px-6">
        <div className="text-center text-gray-600 py-10">
          <p className="text-lg font-medium">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6">
        <div className="text-center text-red-600 py-10">
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row max-md:space-y-2 justify-between items-center mb-6">
        <h2 className="md:text-lg text-sm font-semibold text-gray-800">All Projects</h2>
        <div className="flex gap-3">
          <select className="bg-white shadow-md rounded-lg md:px-8 px-4 py-2 text-sm">
            <option>All Projects</option>
          </select>
          <select className="bg-white shadow-md rounded-lg md:px-8 px-4 py-2 text-sm">
            <option>Sort by: Recent</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center items-center text-gray-600 py-10">
          <p className="text-lg font-medium">No project.</p>
          <p className="text-sm">Contact Ishelter to start a project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {projects.map((project) => {
            const completion = getCompletion(project.projectStatus);
            const statusColor = getStatusColor(project.projectStatus);
            
            return (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Project Image + Status */}
                <div className="relative">
                  <img
                    src={project.image || placeholderImage}
                    alt={project.projectName}
                    className="w-full h-48 object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
                  >
                    {project.projectStatus}
                  </span>
                </div>

                {/* Project Info */}
                <div className="p-4 md:mt-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {project.projectName}
                  </h3>
                  <p className="flex items-center md:mt-2 text-gray-600 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    {project.location || 'Location not specified'}
                  </p>

                  {/* Progress */}
                  <div className="mb-4 md:mt-4">
                    <p className="text-sm text-gray-700 mb-1">
                      Project Completion {completion}%
                    </p>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="h-2 bg-orange-500 rounded-full"
                        style={{ width: `${completion}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Update */}
                  <div className="text-sm text-gray-600 flex md:mt-8 items-center mb-1">
                    <FaClock className="mr-2 text-gray-500" /> Last update:{" "}
                    {formatDate(project.startDate)}
                  </div>
                  <p className="text-sm text-gray-500 mb-4 md:mt-4">
                    {project.shortDescription || 'No description available'}
                  </p>

                  {/* Button */}
                <Link href={'#'} className="md:mt-4">
                <button
                    type="button"
                    className="w-full cursor-pointer border border-primary md:mt-4 text-primary font-medium rounded-lg py-2 hover:bg-orange-50 flex items-center justify-center gap-2"
                  >
                    <p>View Details </p>
                    <FaArrowRight />
                  </button>
                </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}