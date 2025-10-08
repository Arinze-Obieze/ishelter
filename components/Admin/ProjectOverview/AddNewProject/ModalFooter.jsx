import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa"

export default function ModalFooter({ 
  currentStep, 
  onBack, 
  onNext, 
  onCancel, 
  onSubmit, 
  isSubmitting 
}) {
  return (
    <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
      {currentStep === 1 ? (
        <>
          <button
            onClick={onCancel}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
            disabled={isSubmitting}
          >
            <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            Cancel
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            Next Step
            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </>
      ) : currentStep === 2 ? (
        <>
          <button
            onClick={onBack}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
            disabled={isSubmitting}
          >
            <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
            disabled={isSubmitting}
          >
            Next Step
            <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </>
      ) : (
        <>
          <button
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
              disabled={isSubmitting}
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Back
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating...</span>
                </>
              ) : (
                <>
                  <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Create Project & Finish</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  )
}