import React from "react";
import { FiUser, FiCheckCircle, FiMessageSquare, FiDollarSign, FiAlertTriangle } from "react-icons/fi";

const activities = [
  {
    id: "1",
    icon: <FiUser className="w-4 h-4 text-white" />,
    title: "New client signed up",
    description: "TechFusion Inc. has created a new account",
    timestamp: "15 minutes ago",
    iconBg: "bg-orange-500",
  },
  {
    id: "2",
    icon: <FiCheckCircle className="w-4 h-4 text-white" />,
    title: "Project status changed",
    description: "Website Redesign project marked as Completed",
    timestamp: "2 hours ago",
    iconBg: "bg-orange-500",
  },
  {
    id: "3",
    icon: <FiMessageSquare className="w-4 h-4 text-white" />,
    title: "Consultation lead received",
    description: "New lead from john@example.com",
    timestamp: "3 hours ago",
    iconBg: "bg-orange-500",
  },
  {
    id: "4",
    icon: <FiDollarSign className="w-4 h-4 text-white" />,
    title: "Invoice paid",
    description: "Invoice #INV-2023-042 paid by GlobalTech",
    timestamp: "5 hours ago",
    iconBg: "bg-orange-500",
  },
  {
    id: "5",
    icon: <FiAlertTriangle className="w-4 h-4 text-white" />,
    title: "System alert triggered",
    description: "Database backup failed",
    timestamp: "Yesterday at 11:42 PM",
    iconBg: "bg-orange-500",
  },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">View All</button>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center`}>
              {activity.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
              <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
