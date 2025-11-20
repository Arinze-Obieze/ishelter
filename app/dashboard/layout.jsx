'use client'
import withAuthProtection from "@/components/Dashboard/withAuthProtection";
import Header from '@/components/Dashboard/Header'
import MobileSidebar from '@/components/Dashboard/MobileSidebar';
import React, { useState } from 'react'
import { PersonalProjectsProvider } from "@/contexts/PersonalProjectsContext";
import { DocumentsProvider } from '@/contexts/DocumentsContext'
import { UserProvider } from "@/contexts/UserContext";
import { LiveFeedProvider } from "@/contexts/LiveFeedContext";
import {CurrentClientProvider} from "@/contexts/CurrentClientContext";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { NotificationProvider } from '@/contexts/NotificationContext'

const ProtectedLayout = withAuthProtection(function Layout({children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <CurrentClientProvider>
      <UserProvider> 
        <NotificationProvider>
        <PersonalProjectsProvider> 
          <LiveFeedProvider>
            <DocumentsProvider>
              <InvoiceProvider>
                <div className='bg-gray-100 min-h-screen'>
                  <Header onMenuClick={handleMenuClick} />
                  <MobileSidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
                  {children}
                </div>
              </InvoiceProvider>
            </DocumentsProvider>
          </LiveFeedProvider>
        </PersonalProjectsProvider>
        </NotificationProvider>
      </UserProvider>
    </CurrentClientProvider>
  );
});

export default ProtectedLayout;