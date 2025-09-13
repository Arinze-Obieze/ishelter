import { IoNotificationsOutline } from "react-icons/io5";

const Notifications = () => {
  // Notification data array
  const notificationsData = [
    // {
    //   id: 1,
    //   icon: "📄",
    //   title: "New invoice available",
    //   description: "Invoice #2034 for Lekki Duplex is ready for review",
    //   time: "2 hours ago",
    //   project: "Duplex at Lekki",
    //   color: "text-primary",
    // },
    // {
    //   id: 2,
    //   icon: "✓",
    //   title: "Approval needed",
    //   description: "Design plan for Ikeja property requires your approval",
    //   time: "Yesterday",
    //   project: "Ikeja Commercial Property",
    //   color: "text-primary",
    // },
    // {
    //   id: 3,
    //   icon: "✉️",
    //   title: "Message from Project Manager",
    //   description: "Lisa: Updates on Highland Park project timeline",
    //   time: "2 days ago",
    //   project: "Modern Residence - Highland Park",
    //   color: "text-primary",
    // },
    // {
    //   id: 4,
    //   icon: "📦",
    //   title: "Material selection required",
    //   description: "Please select flooring options for Abuja Office Complex",
    //   time: "3 days ago",
    //   project: "Abuja Office Complex",
    //   color: "text-primary",
    // },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 py-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 place-items-center">
          <IoNotificationsOutline className="text-primary text-base" />
          Notifications
        </h3>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
          {notificationsData.length}
        </span>
      </div>

      {notificationsData.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm">
          No notifications
        </div>
      ) : (
        <>
          <div className="space-y-4 text-sm mt-4">
            {notificationsData.map((notification) => (
              <div key={notification.id} className="pb-3">
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <span className={notification.color}>{notification.icon}</span>{" "}
                  {notification.title}
                </p>
                <p className="text-text font-light text-xs mt-1 px-6">
                  {notification.description}
                </p>
                <div className="flex justify-between text-xs text-gray-400 mt-1 px-6">
                  <span>{notification.time}</span>
                  <span className="text-primary font-medium">
                    {notification.project}
                  </span>
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
  );
};

export default Notifications;
