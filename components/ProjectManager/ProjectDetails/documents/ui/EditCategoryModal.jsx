import { AiOutlineClose } from "react-icons/ai";

export const EditCategoryModal = ({ 
  isOpen, 
  onClose, 
  documentToEdit, 
  editCategory, 
  setEditCategory, 
  categories, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Edit Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Document: {documentToEdit?.name}</p>
          <p className="text-xs text-gray-500">Current: {documentToEdit?.category || 'General'}</p>
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select new category
        </label>
        <select
          value={editCategory}
          onChange={(e) => setEditCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!editCategory}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};