import React from 'react'
import { FiPlus } from 'react-icons/fi'

const ProjectTeam = () => {

    const teamMembers = [
        { name: "John Adebayo", role: "Project Manager", initials: "JA" },
        { name: "Sarah Okafor", role: "Senior Architect", initials: "SO" },
        { name: "Mike Johnson", role: "Construction Manager", initials: "MJ" },
        { name: "Amara Nwosu", role: "Site Engineer", initials: "AN" },
        { name: "David Okonkwo", role: "Quantity Surveyor", initials: "DO" },
      ]

  return (
   <div className="w-80 bg-white rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Project Team</h3>
                    <div className="flex gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded">
                        <FiPlus size={18} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
  
                  <div className="space-y-3">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {member.initials}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.role}</div>
                          </div>
                        </div>
                        <button className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                          i
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
  )
}

export default ProjectTeam
