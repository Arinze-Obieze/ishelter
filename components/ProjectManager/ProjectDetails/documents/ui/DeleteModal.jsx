import { AiOutlineClose } from "react-icons/ai";

export const DeleteModal = ({ 
  isOpen, 
  onClose, 
  documentToDelete, 
  onConfirm, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-red-600">Delete Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
            disabled={isDeleting}
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-2">
            Are you sure you want to delete this document?
          </p>
          <p className="text-sm font-medium text-gray-900">
            {documentToDelete?.name}
          </p>
          <p className="text-xs text-red-600 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 justify-end [&>*]:cursor-pointer">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};