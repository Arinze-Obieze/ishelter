'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjectNameById } from '@/utils/projectHelpers'; // We'll create this helper

export default function Breadcrumbs({ projectId, tab }) {
  const [projectName, setProjectName] = useState('Project');

  useEffect(() => {
    async function fetchName() {
      const name = await getProjectNameById(projectId);
      setProjectName(name || 'Project');
    }
    fetchName();
  }, [projectId]);

  return (
    <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <Link href="/project-manager">Projects</Link>
          <span className="mx-2">/</span>
        </li>
        <li className="flex items-center">
          <span className="font-medium text-gray-700">{projectName}</span>
          <span className="mx-2">/</span>
        </li>
        <li className="flex items-center">
          <span className="capitalize text-orange-600 font-semibold">{tab}</span>
        </li>
      </ol>
    </nav>
  );
}
