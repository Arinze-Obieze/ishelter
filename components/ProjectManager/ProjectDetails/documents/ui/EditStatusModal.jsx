// components/ProjectManager/ProjectDetails/documents/ui/EditStatusModal.js
import { AiOutlineClose } from "react-icons/ai";

export const EditStatusModal = ({ 
  isOpen, 
  onClose, 
  documentToEdit, 
  editStatus, 
  setEditStatus, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  const statusOptions = [
    { value: "Pending Approval", label: "Pending Approval", color: "orange" },
    { value: "Uploaded", label: "Uploaded", color: "green" }
  ];

  return (
    <div className="fixed backdrop-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Document Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Document: {documentToEdit?.name}</p>
          <p className="text-xs text-gray-500">
            Current Status: 
            <span className={`ml-1 px-2 py-1 text-xs font-medium rounded ${
              documentToEdit?.statusColor === 'orange' ? 'bg-orange-50 text-orange-700' :
              documentToEdit?.statusColor === 'green' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {documentToEdit?.status || 'Unknown'}
            </span>
          </p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select new status
        </label>
        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
        >
          <option value="">Select status...</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Status Preview */}
        {editStatus && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <span className={`px-3 py-1 rounded text-sm font-medium ${
              statusOptions.find(opt => opt.value === editStatus)?.color === 'orange' 
                ? 'bg-orange-50 text-orange-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {editStatus}
            </span>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!editStatus}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};