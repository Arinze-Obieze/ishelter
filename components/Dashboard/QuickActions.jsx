import {FaPlus, FaFileAlt, FaCreditCard, FaHeadset, FaCalendarAlt } from "react-icons/fa";

const QuickActions = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4  space-y-3">
    <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
    <button className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
      <FaPlus /> Start a New Project
    </button>
    <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
      <FaFileAlt /> View Documents
    </button>
    <button className="w-full bg-green-500 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
      <FaCreditCard /> Manage Payments
    </button>
    <button className="w-full bg-purple-600 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
      <FaHeadset /> Contact Support
    </button>
    <button className="w-full bg-gray-700 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
      <FaCalendarAlt /> Schedule a Meeting
    </button>
  </div>
  )
}

export default QuickActions
