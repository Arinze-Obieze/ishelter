import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const Pagination = ({ currentPage, totalPages, onPageChange, className = "" }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <p className="text-sm text-gray-500">Showing page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Page numbers would go here */}
        <span className="px-3 py-1 bg-orange-500 text-white rounded text-sm font-medium">
          {currentPage}
        </span>
        
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Pagination