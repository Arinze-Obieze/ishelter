import Cards from '@/components/Dashboard/Documents/Cards'
import { DocumentsStats } from '@/components/Dashboard/Documents/Stats'
import React from 'react'

const Documents = () => {
  return (
      <div>
        <DocumentsStats/>
        <Cards/>
      </div>
  )
}

export default Documents
