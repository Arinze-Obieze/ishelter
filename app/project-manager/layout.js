'use client'
import { useState } from 'react';
import Sidebar from '@/components/ProjectManager/Sidebar'
import Header from '@/components/ProjectManager/Header'
import { ProjectManagerProvider } from '@/contexts/ProjectManagerProjectsContext';
import withProjectManagerProtection from '@/components/ProjectManager/withProjectManagerProtection';
import { ProjectsProvider } from '@/contexts/ProjectContext'
import { UserProvider } from '@/contexts/UserContext';
import { InvoiceProvider } from '@/contexts/InvoiceContext';
import { ClientsProvider } from '@/contexts/ClientsContext';

function ProjectManagerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <UserProvider> 
    <ProjectsProvider>
      <ClientsProvider>
<ProjectManagerProvider> 
<InvoiceProvider>
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
  </InvoiceProvider>
  </ProjectManagerProvider>
  </ClientsProvider>
  </ProjectsProvider>
  </UserProvider>

);
}

const ProtectedProjectManagerLayout = withProjectManagerProtection(ProjectManagerLayout);
export default ProtectedProjectManagerLayout;
