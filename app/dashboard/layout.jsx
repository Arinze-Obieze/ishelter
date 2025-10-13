'use client'
import withAuthProtection from "@/components/Dashboard/withAuthProtection";
import Header from '@/components/Dashboard/Header'
import React from 'react'
import { PersonalProjectsProvider } from "@/contexts/PersonalProjectsContext";
import { DocumentsProvider } from '@/contexts/DocumentsContext'


const ProtectedLayout = withAuthProtection(function Layout({children}) {
  return (
     <PersonalProjectsProvider> 
          <DocumentsProvider>

    <div className='bg-gray-100 min-h-screen'>
      <Header/>
      {children}
    </div>
    </DocumentsProvider>
  </PersonalProjectsProvider>
  );
});

export default ProtectedLayout;



