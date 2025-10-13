import React from 'react';
import DocumentsTab from '@/components/ProjectManager/ProjectDetails/Documents';

export default function Page({ params }) {
  const { projectId } = params;
  return <DocumentsTab projectId={projectId} />;
}
