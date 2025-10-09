import StatCard from './StatsCard';

const stats = [
  {
    label: 'Active Clients',
    value: 0,
    trend: '+8% from last month',
    trendType: 'up'
  },
  {
    label: 'Active Projects',
    value: 2,
    trend: '+12% from last month',
    trendType: 'up'
  },
  {
    label: 'Consultation Leads',
    value: 2,
    trend: '+5% this week',
    trendType: 'up'
  },
  {
    label: 'Revenue This Month',
    value: '$0',
    trend: '0% from last month',
    trendType: 'down'
  },
  {
    label: 'Pending Approvals',
    value: 0,
    trend: '0% from last week',
    trendType: 'up'
  }
];


const AdminStats = () => (
  <section className="w-full bg-gray-50 py-4 px-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((card, i) => (
        <StatCard key={i} {...card} />
      ))}
    </div>
  </section>
);

export default AdminStats;
