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
  const [revenueYTD, setRevenueYTD] = useState(0);
  const [revenueLoading, setRevenueLoading] = useState(true);

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

  // Fetch and calculate total revenue (YTD)
  useEffect(() => {
    const fetchRevenueYTD = async () => {
      try {
        setRevenueLoading(true);
        // Fetch all invoices
        const invoicesSnapshot = await getDocs(collection(db, 'invoices'));
        const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Fetch all consultation registrations
        const consultationsSnapshot = await getDocs(collection(db, 'consultation-registrations'));
        const consultations = consultationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Get current year
        const currentYear = new Date().getFullYear();
        // Paid invoices (YTD)
        const paidInvoicesYTD = invoices.filter(inv => {
          if (inv.status !== 'paid') return false;
          const paidDate = inv.paidAt?.toDate ? inv.paidAt.toDate() : (inv.createdAt?.toDate ? inv.createdAt.toDate() : new Date(inv.createdAt));
          return paidDate.getFullYear() === currentYear;
        });
        // Paid consultations (YTD)
        const paidConsultationsYTD = consultations.filter(c => {
          if (!(c.status === 'paid' || c.payment === 'success')) return false;
          const paidDate = c.paidAt?.toDate ? c.paidAt.toDate() : (c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt));
          return paidDate.getFullYear() === currentYear;
        });
        // Consultation amount helper
        const getConsultationAmount = (consultation) => {
          if (consultation.plan === 'BuildPath Consultation') return 498;
          return 299;
        };
        // Calculate totals
        const invoiceRevenueYTD = paidInvoicesYTD.reduce((sum, inv) => sum + Number(inv.amount), 0);
        const consultationRevenueYTD = paidConsultationsYTD.reduce((sum, c) => sum + getConsultationAmount(c), 0);
        setRevenueYTD(invoiceRevenueYTD + consultationRevenueYTD);
      } catch (error) {
        setRevenueYTD(0);
      } finally {
        setRevenueLoading(false);
      }
    };
    fetchRevenueYTD();
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
    // {
    //   label: 'Consultation Leads',
    //   value: leadsLoading ? '...' : consultationLeads,
    //   loading: leadsLoading
    // },
    {
      label: 'Total Revenue (YTD)',
      value: revenueLoading ? '...' : `₦${revenueYTD.toLocaleString()}`,
      loading: revenueLoading
    },
    {
      label: 'Pending Approvals',
      value: 0,
      loading: false
    }
  ];

  return (
    <section className="w-full bg-gray-50 py-4 px-2">
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>
    </section>
  );
};

export default AdminStats;