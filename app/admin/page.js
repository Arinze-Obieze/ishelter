import AdminStats from '@/components/Admin/AdminStats'
import  QuickActions  from '@/components/Admin/QuickActions'
import SystemAlerts from '@/components/Admin/SystemAlerts'
import RecentActivity from '@/components/Admin/RecentActivity'
import ConsultationLeads from '@/components/Admin/ConsultationLeads'


function AdminDashboard() {
  return (
    <div className=''>
      
<div className="max-md:grid grid-cols-2 "> 
<AdminStats/>  
</div>


<SystemAlerts/>

<div className='flex flex-col md:flex-row gap-4 mt-4'> 
  <RecentActivity className='flex-1'/>
<div className="space-y-8">
<QuickActions/>
<ConsultationLeads/>
</div>

</div>
    </div>
  )
}

export default AdminDashboard
