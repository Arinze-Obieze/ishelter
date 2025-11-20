'use client'
import { useState } from 'react';
import withAdminProtection from "@/components/Admin/withAdminProtection";
import Sidebar from '@/components/Admin/Sidebar'
import Header from '@/components/Admin/Header'
import { UserProvider } from '@/contexts/UserContext';
import { ProjectsProvider } from '@/contexts/ProjectContext';
import { ProjectUsersProvider } from '@/contexts/ProjectUsersContext';
import { ConsultationProvider } from '@/contexts/ConsultationContext';
import { LeadActionsProvider } from '@/contexts/LeadActionsContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

function AdminLayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
  <UserProvider>
    <NotificationProvider>
    <ProjectsProvider>
      <ProjectUsersProvider>
      <ConsultationProvider>
      <LeadActionsProvider>
        <div className="min-h-screen bg-gray-100 flex">
          {/* Sidebar (renders desktop + mobile internally) */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col md:ml-64">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-1 p-2 md:p-2 ">
              {children}
            </main>
            
          </div>
        </div>
        </LeadActionsProvider>
        </ConsultationProvider>
      </ProjectUsersProvider>
    </ProjectsProvider>
    </NotificationProvider>
  </UserProvider>
  );
}

// Apply HOC
const AdminLayout = withAdminProtection(AdminLayoutContent);
export default AdminLayout;
