import { FaTimes } from "react-icons/fa"

export default function ModalContainer({ children, onClose, isSubmitting }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative mx-auto max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <FaTimes className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  )
}