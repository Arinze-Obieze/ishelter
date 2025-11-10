import AdminStats from '@/components/Admin/AdminStats'
import  QuickActions  from '@/components/Admin/QuickActions'
import SystemAlerts from '@/components/Admin/SystemAlerts'
import RecentActivity from '@/components/Admin/RecentActivity'
import ConsultationLeads from '@/components/Admin/Consultation/ConsultationLeads'


function AdminDashboard() {
  return (
    <div className=''>
      
<div className=""> 
<AdminStats/>  
</div>


<SystemAlerts/>

<div className='flex flex-col md:flex-row gap-4 mt-4'> 
 <div className='md:flex-[2] flex-1'>
 <RecentActivity />
 </div>

<div className="space-y-8 md:flex-1">
<QuickActions/>
{/* <ConsultationLeads/> */}
</div>

</div>
    </div>
  )
}

export default AdminDashboard
