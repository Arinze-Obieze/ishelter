
export default function LoadingState() {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-2 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading consultation leads...</p>
        </div>
      </div>
    )
  }