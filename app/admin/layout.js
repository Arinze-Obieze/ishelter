"use client";
import { useState } from "react";
import withAdminProtection from "@/components/Admin/withAdminProtection";
import Sidebar from "@/components/Admin/Sidebar";
import Header from "@/components/Dashboard/Header";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return withAdminProtection(() => (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  ))();
}
