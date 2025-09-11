'use client'
import { useState } from 'react';
import Sidebar from '@/components/SuccessManager/Sidebar'
import Header from '@/components/SuccessManager/Header'


export default function SuccessManagerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="flex">
    <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
    
          <div className="flex-1 flex flex-col">
          <Header onMenuClick={handleMenuClick} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  </div>
);
}
