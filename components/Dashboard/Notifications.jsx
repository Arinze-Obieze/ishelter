import { IoNotificationsOutline } from 'react-icons/io5'
import { useNotifications } from '@/contexts/NotificationContext'

const formatTime = (ts) => {
  if (!ts) return ''
  // Firestore Timestamp -> Date
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleString()
}

const Notifications = () => {
  const { notifications = [], loading, unreadCount } = useNotifications()

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 py-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 place-items-center">
          <IoNotificationsOutline className="text-primary text-base" />
          Notifications
        </h3>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
          {loading ? '…' : unreadCount}
        </span>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-6 text-sm">Loading…</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm">No notifications</div>
      ) : (
        <>
          <div className="space-y-4 text-sm mt-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="pb-3">
                <p className="font-medium text-gray-800">{notification.title}</p>
                <p className="text-text font-light text-xs mt-1 px-1">{notification.body}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
                  <span>{formatTime(notification.createdAt)}</span>
                  {notification.projectId && (
                    <span className="text-primary font-medium">Project</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full font-meduim leading-5 text-primary text-sm font-medium mt-4 hover:underline">
            View All Notifications
          </button>
        </>
      )}
    </div>
  )
}

export default Notifications
