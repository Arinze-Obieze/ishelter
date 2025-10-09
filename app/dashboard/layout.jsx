'use client'
import withAuthProtection from "@/components/Dashboard/withAuthProtection";
import Header from '@/components/Dashboard/Header'
import React from 'react'
import { PersonalProjectsProvider } from "@/contexts/PersonalProjectsContext";

const ProtectedLayout = withAuthProtection(function Layout({children}) {
  return (
     <PersonalProjectsProvider> 
    <div className='bg-gray-100 min-h-screen'>
      <Header/>
      {children}
    </div>
    </PersonalProjectsProvider>
  );
});

export default ProtectedLayout;



