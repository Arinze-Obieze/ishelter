'use client'
import withAuthProtection from "@/components/Dashboard/withAuthProtection";
import Header from '@/components/Dashboard/Header'
import React from 'react'
import { PersonalProjectsProvider } from "@/contexts/PersonalProjectsContext";
import { DocumentsProvider } from '@/contexts/DocumentsContext'
import { UserProvider } from "@/contexts/UserContext";
import { LiveFeedProvider } from "@/contexts/LiveFeedContext";
import {CurrentClientProvider} from "@/contexts/CurrentClientContext";

const ProtectedLayout = withAuthProtection(function Layout({children}) {
  return (
    <CurrentClientProvider>
    <UserProvider> 
             <PersonalProjectsProvider> 
      <LiveFeedProvider>
          <DocumentsProvider>
    <div className='bg-gray-100 min-h-screen'>
      <Header/>
      {children}
    </div>
    </DocumentsProvider>
    </LiveFeedProvider>
  </PersonalProjectsProvider>
  </UserProvider>
  </CurrentClientProvider>

  );
});

export default ProtectedLayout;



