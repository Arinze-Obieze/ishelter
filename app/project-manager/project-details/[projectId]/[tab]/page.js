import React from 'react';
import dynamic from 'next/dynamic';

const OverviewTab = dynamic(() => import('@/components/ProjectManager/ProjectDetails/OverviewTab'));
const DocumentsTab = dynamic(() => import('@/components/ProjectManager/ProjectDetails/Documents'));

const TAB_COMPONENTS = {
  overview: OverviewTab,
  documents: DocumentsTab,
  // Add more tabs as needed
};

export default function ProjectTabPage({ params }) {
  const { tab } = params;
  const TabComponent = TAB_COMPONENTS[tab] || (() => <div>Tab not found</div>);
  return <TabComponent projectId={params.projectId} />;
}
