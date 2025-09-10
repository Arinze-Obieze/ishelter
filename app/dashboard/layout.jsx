import Header from '@/components/Dashboard/Header'
import React from 'react'

const layout = ({children}) => {
  return (
    <>
   <div className='bg-gray-100 min-h-screen'>
   <Header/>
   {children}
   </div>
    </>
  )
}

export default layout
