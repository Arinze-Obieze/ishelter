import StatCard from './StatsCard'


const ConsultationStats = () => {

    const stats = [
        {
          label: 'Total Leads (MTD)',
          value: 30,
          trend: '+12% from last month',
          trendType: 'up'
        },
        {
          label: 'Unassigned Leads',
          value: 5,
          trend: '-5% from last month',
          trendType: 'down'
        },
        {
          label: 'Assigned Leads',
          value: 25,
          trend: '+5% this week',
          trendType: 'up'
        },
        {
          label: 'Completed Consultations',
          value: '18',
          trend: '+20% from last month',
          trendType: 'up'
        },
     
      ];

    return (
    <section className="w-full  py-4 px-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center items-center mx-auto">
      {stats.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  </section>
  )
}

export default ConsultationStats
