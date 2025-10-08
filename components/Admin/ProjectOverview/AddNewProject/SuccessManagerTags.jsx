import { FaTimes } from "react-icons/fa"

export default function SuccessManagerTags({ 
  successManagers, 
  successManagerIds, 
  onRemoveSuccessManager, 
  isSubmitting 
}) {
  return (
    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[44px] mt-2">
      {successManagers.length > 0 ? (
        successManagers.map((manager, index) => (
          <span
            key={successManagerIds[index]}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded"
          >
            {manager}
            <button 
              onClick={() => onRemoveSuccessManager(manager, successManagerIds[index])} 
              className="text-blue-500 hover:text-blue-700"
              disabled={isSubmitting}
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </span>
        ))
      ) : (
        <span className="text-xs sm:text-sm text-gray-400">No success managers added</span>
      )}
    </div>
  )
}