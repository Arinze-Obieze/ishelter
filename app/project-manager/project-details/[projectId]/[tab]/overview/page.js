import React from 'react';
import OverviewTab from '@/components/ProjectManager/ProjectDetails/OverviewTab';

export default function Page({ params }) {
  const { projectId } = params;
  return <OverviewTab projectId={projectId} />;
}
