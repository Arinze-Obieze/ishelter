'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editEmail, setEditEmail] = useState('');

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
                        <button
                          onClick={() => handleEditClick(affiliate)}
                          className="text-amber-600 hover:text-amber-900"
                          title="Edit Email"
                        >
                          <FaEdit size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
