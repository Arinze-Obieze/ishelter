import ManagerCard from '@/components/Dashboard/ManagerCard';
import Projects from '@/components/Dashboard/Projects';
import StatsOverview from '@/components/Dashboard/StatsOverview';


const Dashboard = () => {
  return (
<>
<StatsOverview/>

<div className="flex justify-center mt-8 mb-7">
        <div className="flex md:flex-row flex-col gap-8 md:max-w-7xl w-full ">
          {/* Projects Section */}
          <div className="flex-1">
            <Projects />
          </div>

          {/* Manager Section */}
          <div className="w-full md:max-w-sm">
            <ManagerCard />
          </div>
        </div>
      </div>

</>
  )
}

export default Dashboard
