"use client"
import withAdminProtection from "@/components/Admin/withAdminProtection";

export default function AdminLayout({ children }) {
  return withAdminProtection(() => (
    <div className="min-h-screen bg-gray-50">
      {/* You can add a sidebar/header here for admin navigation */}
      {children}
    </div>
  ))();
}
