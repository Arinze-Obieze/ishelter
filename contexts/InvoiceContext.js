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
      paymentMethod: docData.paymentMethod || 'link',
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
      return;
    }
    
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

  // Helper function to build HTML email template
  const buildInvoiceEmailHTML = (emailData) => {
    const { invoiceNumber, amount, dueDate, description, projectName, paymentMethod, paymentLink, accountName, accountNumber, bankName } = emailData;
    
    const formattedAmount = `NGN ${Number(amount).toLocaleString()}`;
    const formattedDueDate = new Date(dueDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Invoice</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                i<span style="color: #ffffff;">SHELTER</span>
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                Everythingshelter Nig Ltd
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600;">
                New Invoice Issued
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                A new invoice has been generated for your project <strong>${projectName}</strong>.
              </p>

              <!-- Invoice Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Invoice Number:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Amount Due:</td>
                        <td style="color: #f97316; font-size: 18px; font-weight: bold; text-align: right; padding: 8px 0;">
                          ${formattedAmount}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #6b7280; font-size: 14px; padding: 8px 0;">Due Date:</td>
                        <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">
                          ${formattedDueDate}
                        </td>
                      </tr>
                      ${description ? `
                      <tr>
                        <td colspan="2" style="padding-top: 15px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                            <strong>Description:</strong><br/>
                            ${description}
                          </p>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Information -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                  Payment Information
                </h3>
                
                ${paymentMethod === 'link' && paymentLink ? `
                <!-- Payment Link -->
                <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px; margin: 15px 0;">
                  <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 14px;">
                    Click the button below to pay securely online via Flutterwave:
                  </p>
                  <table cellpadding="0" cellspacing="0" style="margin: 0;">
                    <tr>
                      <td style="background-color: #f97316; border-radius: 6px; text-align: center;">
                        <a href="${paymentLink}" target="_blank" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px;">
                          Pay Now
                        </a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 12px;">
                    Or copy this link: <a href="${paymentLink}" style="color: #3b82f6; word-break: break-all;">${paymentLink}</a>
                  </p>
                </div>
                ` : ''}

                ${paymentMethod === 'account' ? `
                <!-- Bank Transfer -->
                <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 4px; margin: 15px 0;">
                  <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                    Bank Transfer Details:
                  </p>
                  <table width="100%" cellpadding="5" cellspacing="0">
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Account Name:</td>
                      <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 5px 0;">
                        ${accountName}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Account Number:</td>
                      <td style="color: #1f2937; font-size: 16px; font-weight: bold; font-family: 'Courier New', monospace; text-align: right; padding: 5px 0;">
                        ${accountNumber}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #6b7280; font-size: 14px; padding: 5px 0;">Bank Name:</td>
                      <td style="color: #1f2937; font-size: 14px; font-weight: 600; text-align: right; padding: 5px 0;">
                        ${bankName}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top: 10px; border-top: 1px solid #bfdbfe; margin-top: 10px;">
                        <p style="margin: 10px 0 0 0; color: #dc2626; font-size: 13px; font-weight: 600;">
                          ⚠️ Important: Use <strong>${invoiceNumber}</strong> as your payment reference
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>
                ` : ''}
              </div>

              <!-- Important Notes -->
              <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  📌 Important Notes:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; font-size: 13px; line-height: 1.6;">
                  <li>Please ensure payment is made before the due date to avoid late fees</li>
                  <li>Always include the invoice number (${invoiceNumber}) as your payment reference</li>
                  <li>Contact us immediately if you have any questions about this invoice</li>
                </ul>
              </div>

              <!-- Call to Action -->
              <p style="margin: 30px 0 10px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
                If you have any questions or concerns, please don't hesitate to reach out to our team.
              </p>

              <p style="margin: 20px 0 0 0; color: #1f2937; font-size: 15px;">
                Best regards,<br/>
                <strong>The iSHELTER Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 13px;">
                <strong>Everythingshelter Nig Ltd</strong>
              </p>
              <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 12px;">
                📧 everything@everythingshelter.com.ng
              </p>
              <p style="margin: 0 0 5px 0; color: #9ca3af; font-size: 12px;">
                📞 +234 803 484 5266
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                🌐 <a href="https://ishelter.everythingshelter.com.ng" style="color: #f97316; text-decoration: none;">ishelter.everythingshelter.com.ng</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  };

  // Create new invoice with support for both payment methods
  const createInvoice = useCallback(async (invoiceData, projectId) => {
    setLoading(true);
    setError(null);
    try {
      const invoiceNumber = await generateInvoiceNumber(projectId);
      
      const invoicePayload = {
        invoiceNumber,
        amount: invoiceData.amount,
        description: invoiceData.description || '',
        dueDate: invoiceData.dueDate,
        status: 'pending',
        paymentMethod: invoiceData.paymentMethod || 'link',
        paymentLink: invoiceData.paymentLink || null,
        accountName: invoiceData.accountName || null,
        accountNumber: invoiceData.accountNumber || null,
        bankName: invoiceData.bankName || null,
        projectRef: doc(db, 'projects', projectId),
        createdBy: doc(db, 'users', invoiceData.createdBy),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      Object.keys(invoicePayload).forEach(key => {
        if (invoicePayload[key] === null) {
          delete invoicePayload[key];
        }
      });

      const invoiceRef = await addDoc(collection(db, 'invoices'), invoicePayload);

      await updateDoc(doc(db, 'projects', projectId), {
        projectInvoices: arrayUnion(invoiceRef)
      });

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
      await updateDoc(doc(db, 'projects', projectId), {
        projectInvoices: arrayRemove(doc(db, 'invoices', invoiceId))
      });

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
      return `INV-${Date.now().toString().slice(-6)}`;
    }
  };

  // Send email notifications to project clients
  const sendInvoiceEmails = async (invoiceData, projectId, invoiceNumber) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (!projectDoc.exists()) {
        console.error('Project not found');
        return { success: false, error: 'Project not found' };
      }

      const projectData = projectDoc.data();
      
      const clientEmails = [];
      if (projectData.projectUsers && Array.isArray(projectData.projectUsers)) {
        for (const userRef of projectData.projectUsers) {
          try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.email && userData.role === 'client') {
                clientEmails.push({
                  email: userData.email,
                  name: userData.displayName || userData.name || 'Valued Client'
                });
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

      // Build the HTML message
      const htmlMessage = buildInvoiceEmailHTML(emailData);

      // Send individual emails to each client
      const emailPromises = clientEmails.map(client => 
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: client.email,
            name: client.name,
            subject: `New Invoice #${invoiceNumber} - ${projectData.projectName || 'Your Project'}`,
            message: htmlMessage
          })
        })
      );

      const results = await Promise.allSettled(emailPromises);
      
      const failedEmails = results.filter(result => result.status === 'rejected');
      if (failedEmails.length > 0) {
        console.error('Some emails failed to send:', failedEmails);
        return { 
          success: true, 
          warning: `${failedEmails.length} email(s) failed to send` 
        };
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