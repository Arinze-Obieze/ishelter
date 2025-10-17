// components/Admin/ActionDropdown.js
'use client'
import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiUser, FiCheckCircle, FiX } from 'react-icons/fi';
import { useLeadActions } from '@/contexts/LeadActionsContext';

export default function ActionDropdown({ lead }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assignedSM, setAssignedSM] = useState(lead.assignedSM || '');
  const [status, setStatus] = useState(lead.payment);
  const [editData, setEditData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    plan: lead.plan
  });
  
  const dropdownRef = useRef(null);
  const { deleteLead, assignSM, updateStatus, updateLead, loading } = useLeadActions();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      await deleteLead(lead.id);
      setIsOpen(false);
    }
  };

  const handleAssignSM = async () => {
    if (assignedSM.trim()) {
      await assignSM(lead.id, assignedSM);
      setShowAssignModal(false);
      setIsOpen(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (status) {
      await updateStatus(lead.id, status);
      setShowStatusModal(false);
      setIsOpen(false);
    }
  };

  const handleEdit = async () => {
    if (editData.name.trim() && editData.email.trim() && editData.phone.trim()) {
      await updateLead(lead.id, {
        fullName: editData.name,
        email: editData.email,
        phone: editData.phone,
        plan: editData.plan
      });
      setShowEditModal(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded hover:bg-gray-100"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiEdit className="w-4 h-4 mr-2" />
                Edit Lead
              </button>
              
              <button
                onClick={() => {
                  setShowAssignModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiUser className="w-4 h-4 mr-2" />
                {lead.assignedSM ? 'Reassign SM' : 'Assign SM'}
              </button>
              
              <button
                onClick={() => {
                  setShowStatusModal(true);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FiCheckCircle className="w-4 h-4 mr-2" />
                Update Status
              </button>
              
              <hr className="my-1" />
              
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Delete Lead
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assign SM Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Assign Sales Manager</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Manager
              </label>
              <select
                value={assignedSM}
                onChange={(e) => setAssignedSM(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Unassigned</option>
                <option value="Sarah Parker">Sarah Parker</option>
                <option value="John Smith">John Smith</option>
                <option value="Mike Johnson">Mike Johnson</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end p-6 border-t">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSM}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Update Lead Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="NEW">New</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end p-6 border-t">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Lead</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Plan
                </label>
                <select
                  value={editData.plan}
                  onChange={(e) => setEditData(prev => ({ ...prev, plan: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="LandFit Consultation">LandFit Consultation</option>
                  <option value="BuildPath Consultation">BuildPath Consultation</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 justify-end p-6 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={loading || !editData.name.trim() || !editData.email.trim() || !editData.phone.trim()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}