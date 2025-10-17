// contexts/LeadActionsContext.js
'use client'
import { createContext, useContext, useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

const LeadActionsContext = createContext();

export const LeadActionsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const deleteLead = async (leadId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'consultation-registrations', leadId));
      toast.success('Lead deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete lead');
      console.error('Error deleting lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async (leadId, updates) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'consultation-registrations', leadId), updates);
      toast.success('Lead updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update lead');
      console.error('Error updating lead:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignSM = async (leadId, smName) => {
    return updateLead(leadId, { assignedSM: smName });
  };

  const updateStatus = async (leadId, status) => {
    return updateLead(leadId, { status });
  };

  const value = {
    deleteLead,
    updateLead,
    assignSM,
    updateStatus,
    loading
  };

  return (
    <LeadActionsContext.Provider value={value}>
      {children}
    </LeadActionsContext.Provider>
  );
};

export const useLeadActions = () => {
  const context = useContext(LeadActionsContext);
  if (context === undefined) {
    throw new Error('useLeadActions must be used within a LeadActionsProvider');
  }
  return context;
};