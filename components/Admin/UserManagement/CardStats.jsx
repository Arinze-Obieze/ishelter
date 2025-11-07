// components/Admin/UserManagement/CardStats.js
'use client'
import { useUsers } from '@/contexts/UserContext';

const CardStats = () => {
  const { users, loading } = useUsers();

  // Calculate statistics from users - simplified
  const stats = {
    totalUsers: users.length,
    activeClients: users.filter(user => user.role === 'client').length,
    successManagers: users.filter(user => user.role === 'project manager').length,
    admins: users.filter(user => user.role === 'admin').length,
  };

  const statCards = [
    {
      number: loading ? "..." : stats.totalUsers.toString(),
      label: "Total Users",
    },
    {
      number: loading ? "..." : stats.activeClients.toString(),
      label: "Clients",
    },
    {
      number: loading ? "..." : stats.successManagers.toString(),
      label: "Project Managers",
    },
    {
      number: loading ? "..." : stats.admins.toString(),
      label: "Admins",
    },
  ];

  return (
    <div className="w-full bg-gray-50 p-2 md:p-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:max-w-7xl mx-auto">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 md:p-6 text-left transition-all duration-200 hover:shadow-md"
          >
            <div className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
              {stat.number}
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">
              {stat.label}
            </div>
            {loading && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                <div className="bg-gray-300 h-1 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardStats;