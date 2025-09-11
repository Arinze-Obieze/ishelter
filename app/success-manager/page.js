import React from 'react'
import StatCards from '@/components/SuccessManager/StatCards'
import ActionRequired from  "@/components/SuccessManager/ActionRequired"
import MyProjects from '@/components/SuccessManager/MyProjects'


const SuccessManager = () => {
  return (
    <div>
      <StatCards />
      <ActionRequired/>
      <MyProjects/>
    </div>
  )
}

export default SuccessManager


