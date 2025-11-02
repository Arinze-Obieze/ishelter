import { MdFiberManualRecord } from "react-icons/md"

export default function Header() {
  return (
    <header className="px-4 py-6 md:px-6 md:py-4 mx-auto md:mt-4 bg-white">
      <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Stats Container */}
        <div className="flex gap-4 md:gap-8 bg-white md:w-full md:p-4 md:justify-between md:mt-6">
          {/* Active Projects */}
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <span className="text-sm font-semibold text-gray-900 md:text-base">
              4 Active Projects
            </span>
          </div>
          
          {/* Projects Updated */}
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
              <span className="text-sm font-semibold text-gray-900 md:font-normal md:text-gray-600">
                2 Projects Updated Today
              </span>
              <span className="hidden md:inline text-xs text-gray-500">
                Last update at 2:45 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}