import ManagerCard from '@/components/Dashboard/ManagerCard';
import Projects from '@/components/Dashboard/Projects';
import StatsOverview from '@/components/Dashboard/StatsOverview';



const Dashboard = () => {
  return (
<>
<StatsOverview/>

<div className='flex justify-center mt-8'>
<Projects/>
<ManagerCard/>
</div>

</>
  )
}

export default Dashboard
