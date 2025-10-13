import React from 'react'
import StatCards from '@/components/ProjectManager/StatCards'
import ActionRequired from "@/components/ProjectManager/ActionRequired"
import MyProjects from '@/components/ProjectManager/MyProjects'



const ProjectManager = () => {
  return (
    <div>
      <StatCards />
      <ActionRequired/>
      <MyProjects/>
    </div>

  )
}

export default ProjectManager


