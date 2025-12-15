import { FaUserTie } from "react-icons/fa";
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext";

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ProjectTeamCard = () => {
  const { projects, loading } = usePersonalProjects();
  
  const projectTeam = projects.flatMap(project => 
  (project.projectTeam || []).map(member => ({
    ...member,
    projectName: project.projectName // Add project context
  }))
);


  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-3 mb-4">
        <FaUserTie className="text-orange-500 text-xl" />
        <div>
          <p className="text-lg font-bold">Project Team</p>
        </div>
      </div>

      {projectTeam.length > 0 ? (
        <div className="space-y-3">
          {projectTeam.map((member, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm border-2 border-orange-100">
                  {getInitials(member.name)}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-3 py-6">
          <div className="flex items-center justify-center md:space-x-6">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <FaUserTie className="text-gray-400 text-xl" />
            </div>
          </div>
          <p className="text-sm text-center max-w-[250px] text-gray-500">
            No team members have been assigned to this project yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectTeamCard;