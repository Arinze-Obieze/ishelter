import ConsultationLeadList from '@/components/Admin/Consultation/ConsultationLeadList'
import ConsultationStats from '@/components/Admin/Consultation/ConsultationStats'
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
