'use client'
import { useState } from 'react';
import withAdminProtection from "@/components/Admin/withAdminProtection";
import Sidebar from '@/components/Admin/Sidebar'
import Header from '@/components/Dashboard/Header'

function AdminLayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (renders desktop + mobile internally) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
}

// Apply HOC
const AdminLayout = withAdminProtection(AdminLayoutContent);
export default AdminLayout;
