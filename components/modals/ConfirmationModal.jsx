'use client';
import ModalContainer from './ModalContainer';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  isLoading,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false
}) {
  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose} isSubmitting={isLoading}>
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-primary'}`}>
          <FaExclamationTriangle className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8">{message}</p>
        
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-primary hover:bg-orange-600'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </ModalContainer>
  );
}
