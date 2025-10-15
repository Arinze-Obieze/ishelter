import { FaClock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { FiGrid } from "react-icons/fi";
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext";

const StatsOverview = () => {
  const { projects, loading } = usePersonalProjects();

  // Calculate stats from projects
  const total = projects.length;
  const completed = projects.filter(p => (p.status || p.projectStatus)?.toLowerCase() === "completed").length;
  const active = projects.filter(p => (p.status || p.projectStatus)?.toLowerCase() === "active").length;
  const attention = projects.filter(p => (p.status || p.projectStatus)?.toLowerCase().includes("attention")).length;

  const statsData = [
    {
      id: "total",
      label: "Total Projects",
      value: total,
    },
    {
      id: "active",
      label: "Active Projects",
      value: active,
    },
    {
      id: "completed",
      label: "Completed",
      value: completed,
    },
    {
      id: "attention",
      label: "Needs Attention",
      value: attention,
    }
  ];

  // Icon mapping based on ID
  const iconMap = {
    total: FiGrid,
    active: FaClock,
    completed: FaCheckCircle,
    attention: FaExclamationCircle
  };

  // Color mapping based on ID
  const colorMap = {
    total: {
      bg: "bg-blue-100",
      icon: "text-blue-600"
    },
    active: {
      bg: "bg-orange-100",
      icon: "text-orange-400"
    },
    completed: {
      bg: "bg-green-100",
      icon: "text-green-500"
    },
    attention: {
      bg: "bg-red-100",
      icon: "text-red-500"
    }
  };

  return (
    <section className="bg-white rounded-lg p-6 w-full md:max-w-[1248px] mx-auto mt-6">
      <h2 className="flex items-center mb-6 text-gray-800 font-semibold text-lg">
        <FiGrid className="text-primary mr-2 font-bold" />
        Your Projects
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {statsData.map((stat) => {
          const IconComponent = iconMap[stat.id];
          const colors = colorMap[stat.id];
          
          return (
            <div key={stat.id} className="bg-white rounded-lg p-4   shadow-sm">
              <div className={`p-2 rounded-md ${colors.bg} inline-block mb-3`}>
                <IconComponent className={colors.icon} />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="font-bold text-lg text-gray-900">{loading ? "-" : stat.value}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StatsOverview;