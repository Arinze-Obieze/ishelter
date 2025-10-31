import { FiArrowLeft } from "react-icons/fi"

export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <a href="#" className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-3 lg:hidden">
              <FiArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Project</span>
            </a>
            <h1 className="text-3xl font-bold text-foreground">Duplex at Lekki</h1>
            <p className="text-gray-600 mt-1">Live Construction Feed</p>
          </div>
          <a href="#" className="text-orange-600 hover:text-orange-700 font-medium text-sm hidden lg:block">
            ← Back to Project Details
          </a>
        </div>
      </div>
    </div>
  )
}
