const StatCard = ({ label, value, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col">
        <span className="text-gray-500 font-medium">{label}</span>
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-2 mb-2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6 flex flex-col">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-2xl font-semibold text-gray-900 mt-2">{value}</span>
      {/* <span className={`flex items-center text-sm ${trendType === 'up' ? "text-green-500" : "text-red-400"} font-medium`}> {trendType === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />} {trend} </span> */}
    </div>
  );
};

export default StatCard;