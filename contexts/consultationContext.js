'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const ConsultationContext = createContext();

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultation registrations
  useEffect(() => {
    const consultationsQuery = query(
      collection(db, 'consultation-registrations'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(consultationsQuery, 
      (snapshot) => {
        const consultationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setConsultations(consultationsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Total Leads (MTD)
    const totalLeadsMTD = consultations.filter(consultation => {
      const consultationDate = new Date(consultation.createdAt);
      return consultationDate.getMonth() === currentMonth && 
             consultationDate.getFullYear() === currentYear;
    }).length;

    // Unassigned Leads
    const unassignedLeads = consultations.filter(
      consultation => !consultation.assignedSM || consultation.assignedSM === ''
    ).length;

    // Assigned Leads
    const assignedLeads = consultations.filter(
      consultation => consultation.assignedSM && consultation.assignedSM !== ''
    ).length;

    // Completed Consultations
    const completedConsultations = consultations.filter(
      consultation => consultation.status === 'completed' || consultation.payment === 'success'
    ).length;

    return {
      totalLeadsMTD,
      unassignedLeads,
      assignedLeads,
      completedConsultations
    };
  };

  const stats = calculateStats();

  const value = {
    consultations,
    loading,
    error,
    stats
  };

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error('useConsultations must be used within a ConsultationProvider');
  }
  return context;
};