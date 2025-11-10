"use client"

import Link from "next/link"
import { FiUsers, FiGitBranch, FiFileText, FiSettings } from "react-icons/fi"

export default function QuickActions() {
  const actions = [
    {
      title: "Manage Users",
      icon: FiUsers,
      link: '/admin/user-management',
    },
    {
      title: "Oversee Projects",
      icon: FiGitBranch,
      link: "admin/project-overview",
    },
    {
      title: "View Reports",
      icon: FiFileText,
      link: "/admin/billing",
    },
    {
      title: "System Settings",
      icon: FiSettings,
      link: "/admin/settings",
    },
  ]

  return (
    <div className="p-6 bg-white shadow-sm rounded-lg border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-6">
        {actions.map((action, index) => {
          const IconComponent = action.icon
          return (
           <Link 
           key={index}
           href={action.link}>
            <button   
              className="flex flex-col items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
            >
              <IconComponent className="w-8 h-8 text-orange-500 mb-3 group-hover:text-orange-600 transition-colors" />
              <span className="text-sm text-gray-600 text-center font-medium">{action.title}</span>
            </button>
           </Link>
          )
        })}
      </div>
    </div>
  )
}
