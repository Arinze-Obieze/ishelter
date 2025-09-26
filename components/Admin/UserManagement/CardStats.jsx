const CardStats = () => {
    const stats = [
      {
        number: "150",
        label: "Total Users",
      },
      {
        number: "120",
        label: "Active Clients",
      },
      {
        number: "15",
        label: "Success Managers",
      },
      {
        number: "1",
        label: "Admins",
      },
    ]
  
    return (
      <div className="w-full bg-gray-50 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-left">
              <div className="text-xl md:text-2xl font-bold text-gray-700 mb-2">{stat.number}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default CardStats
  