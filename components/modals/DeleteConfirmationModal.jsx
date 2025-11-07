'use client'
import { useState, useEffect } from 'react';
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  user,
  loading = false 
}) => {
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setConfirmText('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  // Add null checks for user
  const isConfirmed = user && confirmText === user.email;

  if (!isOpen || !user) return null;

  return (
    <div className="fixed backdrop-overlay flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-600">
            <FiAlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Permanent Deletion</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This action <strong>cannot be undone</strong>. The user will be permanently removed from:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 mb-4">
            <li>• Authentication (login access)</li>
            <li>• Database (user data)</li>
            <li>• Storage (pictures)</li>
          </ul>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800 mb-2">User to be deleted:</p>
            <p className="text-sm text-red-700">
              <strong>{user.displayName || 'No name'}</strong> ({user.email})
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="confirm-email" className="block text-sm font-medium text-gray-700 mb-2">
            Type <strong>{user.email}</strong> to confirm:
          </label>
          <input
            id="confirm-email"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter email address"
            disabled={loading}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isConfirmed || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                Delete User Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;