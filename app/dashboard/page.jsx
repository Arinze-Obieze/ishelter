'use client'
import StatsOverview from '@/components/Dashboard/StatsOverview';
import Projects from '@/components/Dashboard/Projects';
import WhatsAppGroupsCard from '@/components/Dashboard/WhatsAppGroupsCard';
import ProjectTeamCard from '@/components/Dashboard/ProjectTeamCard';

const Dashboard = () => {
  return (
    <>
      <StatsOverview/>

      <div className="flex justify-center mt-8 mb-7">
        <div className="flex md:flex-row flex-col gap-8 md:max-w-7xl w-full ">
          {/* Projects Section */}
          <div className="flex-1">
            <Projects />
          </div>

          {/* Right Sidebar - WhatsApp Groups & Team */}
          <div className="w-full md:max-w-sm">
            <WhatsAppGroupsCard />
            <ProjectTeamCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard