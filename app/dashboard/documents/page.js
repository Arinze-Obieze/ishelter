import Cards from '@/components/Dashboard/Documents/Cards'
import { DocumentsStats } from '@/components/Dashboard/Documents/Stats'
import { DocumentsProvider } from '@/contexts/DocumentsContext'
import React from 'react'

const Documents = () => {
  return (
    <DocumentsProvider>
      <div>
        <DocumentsStats/>
        <Cards/>
      </div>
    </DocumentsProvider>
  )
}

export default Documents
