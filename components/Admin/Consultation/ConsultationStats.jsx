'use client'
import { useConsultations } from '@/contexts/ConsultationContext';
import StatCard from '../StatsCard';

const ConsultationStats = () => {
  const { stats, loading } = useConsultations();

  const statCards = [
    {
      label: 'Total Leads (MTD)',
      value: loading ? '...' : stats.totalLeadsMTD,
      trend: '0% from last month', 
      trendType: 'up'
    },
    {
      label: 'Unassigned Leads',
      value: loading ? '...' : stats.unassignedLeads,
      trend: '-5% from last month', 
      trendType: 'down'
    },
    {
      label: 'Assigned Leads',
      value: loading ? '...' : stats.assignedLeads,
      trend: '+5% this week', 
    },
    {
      label: 'Completed Consultations',
      value: loading ? '...' : stats.completedConsultations,
      trend: '0% from last month', 
      trendType: 'up'
    },
  ];

  return (
    <section className="w-full py-4 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center items-center mx-auto">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>
    </section>
  );
};

export default ConsultationStats;