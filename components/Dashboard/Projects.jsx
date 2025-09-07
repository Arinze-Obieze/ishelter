import { FaMapMarkerAlt, FaClock, FaCheckCircle, FaArrowRight } from "react-icons/fa";

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Duplex at Lekki",
      location: "Lekki, Lagos",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      completion: 65,
      lastUpdate: "Today, 9:30 AM",
      note: "Foundation work started",
    },
    {
      id: 2,
      title: "Modern Residence - Highland Park",
      location: "Highland Park, IL",
      status: "In Progress",
      statusColor: "bg-blue-100 text-blue-600",
      image:
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      completion: 42,
      lastUpdate: "Yesterday",
      note: "Roofing materials delivered",
    },
    {
      id: 3,
      title: "Ikeja Commercial Property",
      location: "Ikeja, Lagos",
      status: "Awaiting Approval",
      statusColor: "bg-pink-100 text-pink-600",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      completion: 15,
      lastUpdate: "2 days ago",
      note: "Awaiting permit approval",
    },
    {
      id: 4,
      title: "Victoria Island Apartment",
      location: "Victoria Island, Lagos",
      status: "Completed",
      statusColor: "bg-green-100 text-green-600",
      image:
        "https://images.unsplash.com/photo-1600585152900-bf87c2939c86?auto=format&fit=crop&w=800&q=80",
      completion: 100,
      lastUpdate: "Aug 15, 2023",
      note: "Final inspection passed",
    },
  ];

  return (
    <div className=" px-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">All Projects</h2>
        <div className="flex gap-3">
          <select className="bg-white shadow-md  rounded-lg px-8 py-2 text-sm">
            <option>All Projects</option>
          </select>
          <select className="bg-white shadow-md rounded-lg px-8 py-2 text-sm">
            <option>Sort by: Recent</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6  mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Project Image + Status */}
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${project.statusColor}`}
              >
                {project.status}
              </span>
            </div>

            {/* Project Info */}
            <div className="p-4 md:mt-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {project.title}
              </h3>
              <p className="flex items-center md:mt-2 text-gray-600 text-sm mb-3">
                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                {project.location}
              </p>

              {/* Progress */}
              <div className="mb-4 md:mt-4">
                <p className="text-sm text-gray-700 mb-1">
                  Project Completion {project.completion}%
                </p>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>

              {/* Last Update */}
              <div className="tex **:t-sm text-gray-600 flex md:mt-8 items-center mb-1">
                <FaClock className="mr-2 text-gray-500" /> Last update:{" "}
                {project.lastUpdate}
              </div>
              <p className="text-sm text-gray-500 mb-4 md:mt-4">{project.note}</p>

              {/* Button */}
              <button type="button" className="w-full border border-primary md:mt-4 text-primary font-medium rounded-lg py-2 hover:bg-orange-50 flex items-center justify-center gap-2">
                <p>View Details </p>
               <FaArrowRight/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
