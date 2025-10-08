'use client'
import { PersonalProjectsProvider, usePersonalProjects } from '@/contexts/PersonalProjectsContext';
import ManagerCard from '@/components/Dashboard/ManagerCard';
import StatsOverview from '@/components/Dashboard/StatsOverview';


function Projects() {
  const { projects, loading, error } = usePersonalProjects();

  if (loading) return <div>Loading your projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!projects.length) return <div>No projects assigned to you yet.</div>;

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4 bg-white shadow">
          <div className="font-bold text-lg">{project.projectName || 'Untitled Project'}</div>
          <div className="text-sm text-gray-600 mb-1">{project.shortDescription || 'No description provided.'}</div>
          <div className="text-xs text-gray-500">Status: {project.projectStatus || 'N/A'}</div>
          <div className="text-xs text-gray-500">Manager: {project.projectManager || 'N/A'}</div>
          <div className="text-xs text-gray-500">Start: {project.startDate || 'N/A'}</div>
          <div className="text-xs text-gray-500">Budget: {project.initialBudget || 'N/A'}</div>
        </div>
      ))}
    </div>
  );
}

const Dashboard = () => {
  return (
    <PersonalProjectsProvider>
      <>
        <StatsOverview/>

        <div className="flex justify-center mt-8 mb-7">
          <div className="flex md:flex-row flex-col gap-8 md:max-w-7xl w-full ">
            {/* Projects Section */}
            <div className="flex-1">
              <Projects />
            </div>

            {/* Manager Section */}
            <div className="w-full md:max-w-sm">
              <ManagerCard />
            </div>
          </div>
        </div>

      </>
    </PersonalProjectsProvider>
  )
}

export default Dashboard
