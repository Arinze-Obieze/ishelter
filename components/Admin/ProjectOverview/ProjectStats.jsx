import React from "react";
import { FaFolder, FaSpinner, FaCheckCircle, FaPauseCircle } from "react-icons/fa";

const ProjectStats = () => {
  const stats = [
    {
      icon: <FaFolder className="text-primary text-2xl" />,
      title: "Total Projects",
      value: 75,
    },
    {
      icon: <FaSpinner className="text-primary text-2xl" />,
      title: "In Progress",
      value: 50,
    },
    {
      icon: <FaCheckCircle className="text-primary text-2xl" />,
      title: "Completed",
      value: 15,
    },
    {
      icon: <FaPauseCircle className="text-primary text-2xl" />,
      title: "On Hold",
      value: 10,
    },
  ];

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-8xl p-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-2 border border-gray-100"
          >
            <div>{item.icon}</div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;
