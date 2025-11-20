'use client'
import { useState } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'
import Link from 'next/link'

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

const typeColors = {
  invoice: 'bg-blue-50 border-l-4 border-blue-500',
  'project-update': 'bg-green-50 border-l-4 border-green-500',
  consultation: 'bg-purple-50 border-l-4 border-purple-500',
  'user-signup': 'bg-cyan-50 border-l-4 border-cyan-500',
  'system-alert': 'bg-red-50 border-l-4 border-red-500',
  generic: 'bg-gray-50 border-l-4 border-gray-500',
}

export default function AdminNotificationsPage() {
  const { notifications = [], loading, markAsRead, markAllAsRead, unreadCount } = useNotifications()
  const [filter, setFilter] = useState('all')

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.type === filter)

  const handleMarkAsRead = (e, notificationId) => {
    e.preventDefault()
    markAsRead(notificationId)
  }

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'unread', 'invoice', 'user-signup', 'consultation', 'system-alert'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === f
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all'
              ? 'All'
              : f === 'unread'
                ? `Unread (${notifications.filter((n) => !n.read).length})`
                : f.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition ml-auto"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600 mt-3">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg font-medium">No notifications</p>
            <p className="text-gray-500 text-sm mt-1">
              {filter === 'unread' ? 'You have no unread notifications' : 'You have no notifications yet'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left p-4 rounded-lg transition ${typeColors[notification.type] || typeColors.generic} hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-gray-900 ${!notification.read ? 'text-lg' : ''}`}>
                    {notification.title}
                  </p>
                  <p className="text-gray-700 mt-1 text-sm">{notification.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span>{formatTime(notification.createdAt)}</span>
                    {notification.type && (
                      <span className="px-2 py-1 bg-white/50 rounded-full capitalize">
                        {notification.type.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={(e) => handleMarkAsRead(e, notification.id)}
                      className="px-3 py-1 rounded bg-white/70 hover:bg-white text-xs font-medium text-gray-700"
                    >
                      Mark read
                    </button>
                  </div>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
