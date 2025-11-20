'use client'

import { useState } from 'react'
import StatsOverview from '@/components/Dashboard/StatsOverview';
import Projects from '@/components/Dashboard/Projects';
import WhatsAppGroupsCard from '@/components/Dashboard/WhatsAppGroupsCard';
import ProjectTeamCard from '@/components/Dashboard/ProjectTeamCard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <>
      <StatsOverview/>

      <div className="flex justify-center mt-8 mb-7">
        <div className="flex md:flex-row flex-col gap-8 md:max-w-7xl w-full">
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-1">
            <Projects />
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:block w-full md:max-w-sm">
            <WhatsAppGroupsCard />
            <ProjectTeamCard />
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden w-full">
            {/* Mobile Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                  activeTab === 'whatsapp'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('whatsapp')}
              >
                WhatsApp
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm ${
                  activeTab === 'team'
                    ? 'text-amber-600 border-b-2 border-amber-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('team')}
              >
                Team
              </button>
            </div>

            {/* Mobile Content */}
            <div className="space-y-4">
              {activeTab === 'projects' && <Projects />}
              {activeTab === 'whatsapp' && <WhatsAppGroupsCard />}
              {activeTab === 'team' && <ProjectTeamCard />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard