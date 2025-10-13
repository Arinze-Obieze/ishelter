import React from 'react';
import TabsNavigation from '@/components/ProjectManager/ProjectDetails/TabsNavigation';
import Breadcrumbs from '@/components/ProjectManager/ProjectDetails/Breadcrumbs';

const TABS = ['Overview', 'Documents']; // Add more tabs as needed

export default function ProjectDetailsLayout({ projectId, tab, children }) {
  // Capitalize tab for display
  const tabDisplay = tab.charAt(0).toUpperCase() + tab.slice(1);
  const tabHeading = tabDisplay === 'Overview' ? 'Project Overview' : tabDisplay === 'Documents' ? 'Project Documents' : tabDisplay;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <TabsNavigation
        tabs={TABS}
        activeTab={tabDisplay}
        onTabChange={(newTab) => {
          window.location.href = `/project-manager/project-details/${projectId}/${newTab.toLowerCase()}`;
        }}
      />

  <div className="md:pl-6">
  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0 break-words mt-6">{tabHeading}</h1>
<div>
<Breadcrumbs projectId={projectId} tab={tabDisplay} />
</div>
  </div>
      <div className="mt-6 ">{children}</div>
    </div>
  );
}
