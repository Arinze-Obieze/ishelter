'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'affiliates'),
      orderBy('bookings', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const affiliatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAffiliates(affiliatesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching affiliates:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditClick = (affiliate) => {
    setEditingId(affiliate.id);
    setEditEmail(affiliate.email || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditEmail('');
  };

  const handleSaveEmail = async (affiliateId) => {
    try {
      const affiliateRef = doc(db, 'affiliates', affiliateId);
      await updateDoc(affiliateRef, {
        email: editEmail
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email. Please try again.");
    }
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    data: null, // holds affiliatesToNotify
  });



  const openNotifyModal = (affiliatesToNotify) => {
    if (affiliatesToNotify.length === 0) {
        alert("No affiliates with email addresses selected.");
        return;
    }

    const message = affiliatesToNotify.length === 1 
        ? `Are you sure you want to send a performance update email to ${affiliatesToNotify[0].email}?`
        : `Are you sure you want to send performance update emails to ${affiliatesToNotify.length} affiliates?`;

    setModalState({
        isOpen: true,
        title: 'Send Performance Updates',
        message: message,
        data: affiliatesToNotify
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmNotify = async () => {
    const affiliatesToNotify = modalState.data;
    setSendingEmail(true);
    try {
      const response = await fetch('/api/affiliates/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: affiliatesToNotify.map(a => ({
            email: a.email,
            bookings: a.bookings || 0,
            affiliateId: a.affiliateId
          }))
        }),
      });

      const data = await response.json();

      closeModal(); // Close confirmation modal

      if (response.ok) {
        if (data.summary.failed > 0) {
            alert(`Emails sent: ${data.summary.sent}. Failed: ${data.summary.failed}. Check console for details.`);
        } else {
            alert(`Successfully sent ${data.summary.sent} email(s).`);
        }
      } else {
        alert(data.error || 'Failed to send emails');
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleNotifyAll = () => {
    const validAffiliates = affiliates.filter(a => a.email && a.email.trim() !== '');
    openNotifyModal(validAffiliates);
  };

  const filteredAffiliates = affiliates.filter(affiliate => 
    affiliate.affiliateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (affiliate.email && affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Management</h1>
          <p className="text-gray-500">Track bookings and manage affiliate contact details</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <button
                onClick={handleNotifyAll}
                disabled={loading || sendingEmail}
                className={`px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center ${
                    (loading || sendingEmail) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Sends email to all affiliates with a valid email address"
            >
                {sendingEmail ? 'Sending...' : `Notify All (${affiliates.filter(a => a.email).length})`}
            </button>

            <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search affiliates..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Affiliate ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No affiliates found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{affiliate.affiliateId}</div>
                      <div className="text-xs text-gray-400">ID: {affiliate.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === affiliate.id ? (
                        <div className="flex items-center">
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="block w-full px-2 py-1 text-sm border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 border"
                            placeholder="Enter email"
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">
                          {affiliate.email ? (
                            affiliate.email
                          ) : (
                            <span className="text-gray-400 italic">No email added</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {affiliate.bookings} {affiliate.bookings === 1 ? 'Booking' : 'Bookings'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {editingId === affiliate.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEmail(affiliate.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Save"
                          >
                            <FaSave size={18} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel"
                          >
                            <FaTimes size={18} />
                          </button>
                        </div>
                      ) : (
                        <>
                        <button
                          onClick={() => handleEditClick(affiliate)}
                          className="text-amber-600 hover:text-amber-900"
                          title="Edit Email"
                        >
                          <FaEdit size={18} />
                        </button>
                        
                        <button
                            onClick={() => openNotifyModal([affiliate])}
                            disabled={sendingEmail || !affiliate.email}
                            className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title={affiliate.email ? "Send Update Email" : "Add email to send update"}
                        >
                            EMAIL
                        </button>
                        </>
                      )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmationModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmNotify}
        title={modalState.title}
        message={modalState.message}
        isLoading={sendingEmail}
        confirmText="Send Emails"
      />
    </div>
  );
}
