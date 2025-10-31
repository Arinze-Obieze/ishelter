"use client"

import ProjectCard from "./Card"


const projects = [
  {
    id: 1,
    title: "Duplex at Lekki",
    location: "Lekki Phase 1, Lagos",
    image: "/construction-site-with-wooden-frames.jpg",
    description: "Roofing materials delivered and staged for installation",
    timestamp: "Today at 2:45 PM",
    updateCount: 3,
    progress: 65,
    button: "View Live Feed",
  },
  {
    id: 2,
    title: "Sunset Apartments",
    location: "Victoria Island, Lagos",
    image: "/apartment-building-construction-cranes.jpg",
    description: "Concrete foundation poured for building B",
    timestamp: "Today at 11:20 AM",
    updateCount: 1,
    progress: 32,
    button: "View Live Feed",
  },
  {
    id: 3,
    title: "Tech Park Offices",
    location: "Ikeja, Lagos",
    image: "/office-building-construction-modern.jpg",
    description: "Electrical wiring completed on floors 1-3",
    timestamp: "Yesterday at 4:15 PM",
    updateCount: 5,
    progress: 78,
    button: "View Live Feed",
  },
  {
    id: 4,
    title: "Marina Retail Center",
    location: "Marina, Lagos",
    image: "/retail-center-construction-parking.jpg",
    description: "Project setup in progress. Construction begins next week.",
    timestamp: "Starting July 10, 2023",
    isComingSoon: true,
    updateCount: 0,
    progress: 5,
    button: "View Project Details",
  },
]

export default function ProjectsGrid() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Title */}
      <h1 className="mb-8 text-3xl font-bold text-gray-900 md:mb-12 md:text-4xl">Your Projects, Live</h1>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
