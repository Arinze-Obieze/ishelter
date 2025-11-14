'use client'
import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaUsers } from "react-icons/fa";
import { useProjectManager } from '@/contexts/ProjectManagerProjectsContext';

export default function StatCards() {
  const { projects, loading } = useProjectManager();

  // Calculate stats from projects
  const calculateStats = () => {
    if (!projects || projects.length === 0) {
      return {
        totalClients: 0,
        totalProjects: 0,
        overdueInvoices: 0,
        completedProjects: 0
      };
    }

    // Count unique clients across all projects
    const uniqueClientIds = new Set();
    projects.forEach(project => {
      if (project.projectUsers && Array.isArray(project.projectUsers)) {
        project.projectUsers.forEach(user => {
          // Only count users with role "client"
          if (user.role?.toLowerCase() === "client") {
            uniqueClientIds.add(user.id || user.uid);
          }
        });
      }
    });
    const totalClients = uniqueClientIds.size;

    // Total projects
    const totalProjects = projects.length;

    // Sum all overdue invoices
    const overdueInvoices = projects.reduce((sum, p) => sum + (p.overdueInvoices || 0), 0);

    // Count completed projects
    const completedProjects = projects.filter(p => {
      const status = (p.projectStatus || '').toLowerCase();
      return status === 'completed' || status === 'done';
    }).length;

    return {
      totalClients,
      totalProjects,
      overdueInvoices,
      completedProjects
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      label: "Total Clients",
      value: stats.totalClients,
      icon: <FaUsers className="text-blue-500 text-xl" />,
      bg: "bg-blue-100",
    },
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: <FaClipboardList className="text-amber-500 text-xl" />,
      bg: "bg-orange-100",
    },
    {
      label: "Overdue Invoices",
      value: stats.overdueInvoices,
      icon: <FaExclamationCircle className="text-red-500 text-xl" />,
      bg: "bg-red-100",
    },
    {
      label: "Completed Projects",
      value: stats.completedProjects,
      icon: <FaCheckCircle className="text-green-500 text-xl" />,
      bg: "bg-green-100",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 items-center md:gap-10 gap-2 md:max-w-7xl mx-auto bg-gray-100 justify-center mt-2 md:mt-8 mb-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center bg-white rounded-2xl shadow-sm px-2 py-4 w-40 md:px-6 md:py-6 md:w-64 animate-pulse"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} mr-4`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-300">...</div>
              <div className="md:text-sm text-gray-400 text-wrap leading-tight text-xs">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 items-center md:gap-10 gap-4 md:max-w-7xl mx-auto bg-gray-100 justify-center mt-2 md:mt-8 mb-6">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center bg-white rounded-2xl shadow-sm px-2 py-4 w-40 md:px-6 md:py-6 md:w-64"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} mr-4`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="md:text-sm text-gray-500 leading-tight text-xs break-words whitespace-normal">
              {stat.label === "Total Clients"
                ? (
                  <>
                    Total <span className="block sm:inline">Clients</span>
                  </>
                )
                : stat.label === "Total Projects"
                  ? (
                    <>
                      Total <span className="block sm:inline">Projects</span>
                    </>
                  )
                  : stat.label === "Overdue Invoices"
                    ? (
                      <>
                        Overdue <span className="block sm:inline">Invoices</span>
                      </>
                    )
                    : stat.label === "Completed Projects"
                      ? (
                        <>
                          Completed <span className="block sm:inline">Projects</span>
                        </>
                      )
                      : stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}