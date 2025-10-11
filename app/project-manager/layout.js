'use client'
import { useState } from 'react';
import Sidebar from '@/components/SuccessManager/Sidebar'
import Header from '@/components/SuccessManager/Header'
import { ProjectManagerProvider } from '@/contexts/ProjectManagerProjectsContext';


export default function SuccessManagerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
<ProjectManagerProvider> 
<div className="min-h-screen bg-gray-100">
    <div className="flex">
    <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
    
          <div className="flex-1 flex flex-col md:ml-64">
          <Header onMenuClick={handleMenuClick} />
        <main className="flex-1 p-6 sm:p-2 ">
          {children}
        </main>
      </div>
    </div>
  </div>
  </ProjectManagerProvider>
);
}
