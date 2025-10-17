'use client'
import { useState, useEffect } from 'react';
import StatCard from './StatsCard';
import { useUsers } from '@/contexts/UserContext';
import { useProjects } from '@/contexts/ProjectContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AdminStats = () => {
  const { users, loading: usersLoading } = useUsers();
  const { projects, loading: projectsLoading } = useProjects();
  const [consultationLeads, setConsultationLeads] = useState(0);
  const [leadsLoading, setLeadsLoading] = useState(true);

  // Fetch consultation leads count
  useEffect(() => {
    const fetchConsultationLeads = async () => {
      try {
        const leadsRef = collection(db, 'consultation-registrations');
        const leadsSnapshot = await getDocs(leadsRef);
        setConsultationLeads(leadsSnapshot.size);
      } catch (error) {
        console.error('Error fetching consultation leads:', error);
        setConsultationLeads(0);
      } finally {
        setLeadsLoading(false);
      }
    };

    fetchConsultationLeads();
  }, []);

  // Calculate active clients (users with role 'client')
  const activeClients = users.filter(user => user.role === 'client').length;

  const activeProjects = projects.length;

  const stats = [
    {
      label: 'Active Clients',
      value: usersLoading ? '...' : activeClients,
      loading: usersLoading
    },
    {
      label: 'Active Projects',
      value: projectsLoading ? '...' : activeProjects,
      loading: projectsLoading
    },
    {
      label: 'Consultation Leads',
      value: leadsLoading ? '...' : consultationLeads,
      loading: leadsLoading
    },
    {
      label: 'Revenue This Month',
      value: '$0',
      loading: false
    },
    {
      label: 'Pending Approvals',
      value: 0,
      loading: false
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-4 px-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>
    </section>
  );
};

export default AdminStats;