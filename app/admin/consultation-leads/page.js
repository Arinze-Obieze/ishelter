import ConsultationLeadList from '@/components/Admin/ConsultationLeadList'
import ConsultationStats from '@/components/Admin/ConsultationStats'
import React from 'react'

const ConsultationPage = () => {
  return (
    <div>
     <ConsultationStats/>
     <ConsultationLeadList/>
    </div>
  )
}

export default ConsultationPage
