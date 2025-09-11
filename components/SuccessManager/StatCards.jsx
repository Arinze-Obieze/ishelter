import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaFlag } from "react-icons/fa";

const stats = [
  {
    label: "Active Projects",
    value: 5,
    icon: <FaClipboardList className="text-white text-xl" />,
    bg: "bg-orange-400",
    iconBg: "bg-orange-100",
  },
  {
    label: "Pending Approvals",
    value: 3,
    icon: <FaCheckCircle className="text-orange-400 text-xl" />,
    bg: "bg-orange-100",
    iconBg: "bg-orange-100",
  },
  {
    label: "Overdue Milestones",
    value: 2,
    icon: <FaExclamationCircle className="text-red-500 text-xl" />,
    bg: "bg-red-100",
    iconBg: "bg-red-100",
  },
  {
    label: "Milestones This Week",
    value: 7,
    icon: <FaFlag className="text-green-500 text-xl" />,
    bg: "bg-green-100",
    iconBg: "bg-green-100",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 items-center md:gap-10 gap-2 md:max-w-7xl mx-auto bg-gray-100 justify-center mt-8 mb-6">
      {stats.map((stat, idx) => (
        <div
          key={stat.label}
          className="flex items-center bg-white rounded-2xl shadow-sm px-2 py-4 w-40 md:px-6 md:py-6 md:w-64"
        >
          <div className={`w-5 h-5 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${stat.bg} mr-4`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="md:text-sm text-gray-500 text-wrap leading-tight text-xs ">{stat.label.split('\n')}</div>
            {stat.label.split('\n')[1] && (
              <div className="text-xs text-gray-400">{stat.label.split('\n')[1]}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
