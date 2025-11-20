import React from "react";
import { useNotifications } from "@/contexts/NotificationContext";

const formatTime = (ts) => {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return date.toLocaleDateString()
}

const getIconBg = (type) => {
  const typeMap = {
    'user-signup': 'bg-blue-500',
    'project-update': 'bg-green-500',
    'consultation': 'bg-purple-500',
    'invoice': 'bg-yellow-500',
    'system-alert': 'bg-red-500',
  }
  return typeMap[type] || 'bg-orange-500'
}

const getIcon = (type) => {
  const typeMap = {
    'user-signup': '👤',
    'project-update': '✓',
    'consultation': '💬',
    'invoice': '💰',
    'system-alert': '⚠️',
  }
  return typeMap[type] || '📢'
}

export default function RecentActivity() {
  const { notifications = [], loading } = useNotifications()
  
  // Filter for activity-type notifications (most recent 5)
  const activityNotifications = notifications
    .filter(n => ['user-signup', 'project-update', 'consultation', 'invoice', 'system-alert'].includes(n.type))
    .slice(0, 5)

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <a href="/admin/notifications" className="text-orange-500 hover:text-orange-600 font-medium text-sm">View All</a>
      </div>

      {/* Activity List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activityNotifications.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          activityNotifications.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getIconBg(activity.type)} flex items-center justify-center text-white text-sm`}>
                {getIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 mb-1">{activity.title}</p>
                <p className="text-sm text-gray-600 mb-2">{activity.body}</p>
                <p className="text-xs text-gray-500">{formatTime(activity.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
