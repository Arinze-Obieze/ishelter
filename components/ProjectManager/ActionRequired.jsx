'use client';
import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { FaFolder } from "react-icons/fa";

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

const typeIcons = {
  'message': '💬',
  'document': '📄',
  'invoice': '💰',
  'action-required': '⚠️',
}

export default function ActionRequired() {
  const { notifications = [], loading } = useNotifications()

  // Filter for action-requiring notifications (most recent 10)
  const actionNotifications = notifications
    .filter(n => ['message', 'document', 'invoice', 'action-required'].includes(n.type))
    .slice(0, 10)

  return (
    <div className="p-2 md:p-6 md:max-w-7xl mx-auto bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-xl text-base font-bold text-gray-800 flex items-center gap-2">
          ⚠️ Notifications
        </h2>
        <a href="/project-manager/notifications" className="text-primary hover:text-orange-600 text-sm font-medium">
          View All
        </a>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : actionNotifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No actions required at this time</p>
          <p className="text-gray-400 text-sm mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actionNotifications.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-start justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
              <div className="flex md:gap-4 gap-2">
                <div className={`mt-1 bg-orange-100 w-fit rounded-full h-fit p-2`}>
                  <span className="text-orange-600 text-xl">{typeIcons[item.type] || '📌'}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm max-md:mt-4">{item.body}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 md:mt-2">
                    <span className="flex space-x-2">
                      <FaFolder /> 
                      <p>{item.type?.replace('-', ' ').toUpperCase()}</p>
                    </span>
                    <span>⏱ {formatTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>

              {item.actionUrl && (
                <div className="flex gap-2 ml-4 md:ml-4 max-md:mt-4">
                  <button
                    onClick={() => window.location.href = item.actionUrl}
                    className={`flex items-center gap-2 md:px-3 px-2 py-1 rounded-lg text-xs md:text-sm font-medium transition bg-primary text-white hover:bg-orange-600`}
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}