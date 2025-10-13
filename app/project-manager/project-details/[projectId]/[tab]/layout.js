"use client"
import React from 'react';
import ProjectDetailsLayout from '@/components/ProjectManager/ProjectDetails/ProjectDetailsLayout';

export default function Layout({ children, params }) {
  // Newer versions of nextjs requires using React.use to access params in a client component
  const { projectId, tab } = React.use(params);
  
  return (
    <ProjectDetailsLayout projectId={projectId} tab={tab}>
      {children}
    </ProjectDetailsLayout>
  );
}