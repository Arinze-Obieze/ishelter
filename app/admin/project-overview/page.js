import React from 'react'
import ProjectList from '@/components/Admin/ProjectOverview/ProjectList'
import ProjectStats from '@/components/Admin/ProjectOverview/ProjectStats'

const ProjectOverview = () => {
  return (
    <div>
      <ProjectStats/>
      <ProjectList />
    </div>
  )
}

export default ProjectOverview
