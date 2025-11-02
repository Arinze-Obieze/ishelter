import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const InvoiceContext = createContext();

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const currentProjectIdRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Process invoice data for consistent structure
  const processInvoiceData = (docData) => {
    const baseData = {
      id: docData.id,
      ...docData,
      projectRef: docData.projectRef?.path,
      createdBy: docData.createdBy?.path,
      // Ensure backward compatibility for existing invoices
      paymentMethod: docData.paymentMethod || 'link', // Default to 'link' for existing invoices
      paymentLink: docData.paymentLink || null,
      accountName: docData.accountName || null,
      accountNumber: docData.accountNumber || null,
      bankName: docData.bankName || null
    };
    
    return baseData;
  };

  // Fetch invoices for a specific project with real-time updates
  const fetchInvoices = useCallback((projectId) => {
    if (!projectId || currentProjectIdRef.current === projectId) {
      return; // Already listening to this project
    }
    
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    currentProjectIdRef.current = projectId;
    setLoading(true);
    setError(null);
    
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('projectRef', '==', doc(db, 'projects', projectId))
      );
      
      // Set up new real-time listener
      unsubscribeRef.current = onSnapshot(
        invoicesQuery, 
        (snapshot) => {
          const invoicesData = snapshot.docs.map(doc => 
            processInvoiceData({ id: doc.id, ...doc.data() })
          );
          setInvoices(invoicesData);
          setLoading(false);
        },
        (err) => {
          console.error('Error in invoices snapshot:', err);
          setError('Failed to fetch invoices');
          setLoading(false);
        }
      );

    } catch (err) {
      console.error('Error setting up invoices listener:', err);
      setError('Failed to fetch invoices');
      setLoading(false);
    }
  }, []);

  // Clear invoices when switching projects
  const clearInvoices = useCallback(() => {
    setInvoices([]);
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    currentProjectIdRef.current = null;
  }, []);

  // Create new invoice with support for both payment methods
  const createInvoice = useCallback(async (invoiceData, projectId) => {
    setLoading(true);
    setError(null);
    try {
      // Generate invoice number
      const invoiceNumber = await generateInvoiceNumber(projectId);
      
      // Prepare invoice data with proper structure
      const invoicePayload = {
        // Core invoice fields
        invoiceNumber,
        amount: invoiceData.amount,
        description: invoiceData.description || '',
        dueDate: invoiceData.dueDate,
        status: 'pending',
        
        // Payment method fields (backward compatible)
        paymentMethod: invoiceData.paymentMethod || 'link', // Default to 'link'
        paymentLink: invoiceData.paymentLink || null,
        accountName: invoiceData.accountName || null,
        accountNumber: invoiceData.accountNumber || null,
        bankName: invoiceData.bankName || null,
        
        // References and timestamps
        projectRef: doc(db, 'projects', projectId),
        createdBy: doc(db, 'users', invoiceData.createdBy),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Remove null values for cleaner data
      Object.keys(invoicePayload).forEach(key => {
        if (invoicePayload[key] === null) {
          delete invoicePayload[key];
        }
      });

      // Create invoice in invoices collection
      const invoiceRef = await addDoc(collection(db, 'invoices'), invoicePayload);

      // Add invoice reference to project's projectInvoices array
      await updateDoc(doc(db, 'projects', projectId), {
        projectInvoices: arrayUnion(invoiceRef)
      });

      // Send email notifications
      await sendInvoiceEmails(invoicePayload, projectId, invoiceNumber);

      setLoading(false);
      return { success: true, invoiceId: invoiceRef.id };
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError('Failed to create invoice');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Update invoice status
  const updateInvoiceStatus = useCallback(async (invoiceId, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: newStatus,
        updatedAt: new Date()
      });
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error updating invoice:', err);
      setError('Failed to update invoice');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Delete invoice
  const deleteInvoice = useCallback(async (invoiceId, projectId) => {
    setLoading(true);
    setError(null);
    try {
      // Remove invoice reference from project
      await updateDoc(doc(db, 'projects', projectId), {
        projectInvoices: arrayRemove(doc(db, 'invoices', invoiceId))
      });

      // Delete invoice document
      await deleteDoc(doc(db, 'invoices', invoiceId));

      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('Failed to delete invoice');
      setLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Generate sequential invoice number
  const generateInvoiceNumber = async (projectId) => {
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('projectRef', '==', doc(db, 'projects', projectId))
      );
      
      const snapshot = await getDocs(invoicesQuery);
      const count = snapshot.size + 1;
      return `INV-${count.toString().padStart(3, '0')}`;
    } catch (err) {
      console.error('Error generating invoice number:', err);
      // Fallback to timestamp-based number
      return `INV-${Date.now().toString().slice(-6)}`;
    }
  };

  // Send email notifications to project clients (updated for payment methods)
  const sendInvoiceEmails = async (invoiceData, projectId, invoiceNumber) => {
    try {
      // Fetch project data to get client emails
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) {
        console.error('Project not found');
        return { success: false, error: 'Project not found' };
      }

      const projectData = projectDoc.data();
      
      // Resolve projectUsers references to get emails
      const clientEmails = [];
      if (projectData.projectUsers && Array.isArray(projectData.projectUsers)) {
        for (const userRef of projectData.projectUsers) {
          try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.email && userData.role === 'client') {
                clientEmails.push(userData.email);
              }
            }
          } catch (err) {
            console.error('Error fetching user:', err);
          }
        }
      }

      if (clientEmails.length === 0) {
        console.warn('No client emails found for project');
        return { success: true, warning: 'No clients to notify' };
      }

      const emailData = {
        invoiceNumber,
        amount: invoiceData.amount,
        dueDate: invoiceData.dueDate,
        description: invoiceData.description,
        projectName: projectData.projectName,
        clientNames: clientEmails.join(', '),
        paymentMethod: invoiceData.paymentMethod || 'link',
        ...(invoiceData.paymentMethod === 'link' && {
          paymentLink: invoiceData.paymentLink
        }),
        ...(invoiceData.paymentMethod === 'account' && {
          accountName: invoiceData.accountName,
          accountNumber: invoiceData.accountNumber,
          bankName: invoiceData.bankName
        })
      };

      // Send email via your existing API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: clientEmails,
          subject: `New Invoice - ${projectData.projectName || 'Project'}`,
          template: 'invoice-notification',
          data: emailData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return { success: true };
    } catch (err) {
      console.error('Error sending invoice emails:', err);
      return { success: false, error: err.message };
    }
  };

  const migrateInvoices = useCallback(async (projectId) => {
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('projectRef', '==', doc(db, 'projects', projectId))
      );
      
      const snapshot = await getDocs(invoicesQuery);
      const updatePromises = [];
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!data.paymentMethod) {
          updatePromises.push(
            updateDoc(doc.ref, {
              paymentMethod: 'link',
              updatedAt: new Date()
            })
          );
        }
      });
      
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
        console.log(`Migrated ${updatePromises.length} invoices`);
      }
      
      return { success: true, migrated: updatePromises.length };
    } catch (err) {
      console.error('Error migrating invoices:', err);
      return { success: false, error: err.message };
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    invoices,
    loading,
    error,
    fetchInvoices,
    createInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    clearInvoices,
    clearError,
    migrateInvoices 
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};