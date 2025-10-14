import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";

export const CategoryModal = ({
  isOpen,
  onClose,
  selectedFile,
  selectedCategory,
  setSelectedCategory,
  categories,
  isCreatingCategory,
  setIsCreatingCategory,
  newCategory,
  setNewCategory,
  onAddCategory,
  onUpload
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Select Category</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">File: {selectedFile?.name}</p>
          <p className="text-xs text-gray-500">Size: {(selectedFile?.size / 1024).toFixed(1)} KB</p>
        </div>

        {!isCreatingCategory ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose a category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            >
              <option value="">Select category...</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsCreatingCategory(true)}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-medium mb-4"
            >
              <AiOutlinePlus className="w-4 h-4" />
              Create new category
            </button>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New category name
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && onAddCategory()}
            />

            <div className="flex gap-2 mb-4">
              <button
                onClick={onAddCategory}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  setIsCreatingCategory(false);
                  setNewCategory("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onUpload}
            disabled={!selectedCategory}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};