import { MdFiberManualRecord } from "react-icons/md"

export default function Header() {
  return (
    <header className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Desktop Stats */}
        <div className="hidden gap-8 bg-white md:w-full  md:p-8 md:flex md:justify-between md:mt-6">
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <span className="font-semibold text-gray-900">4 Active Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <span className="text-sm text-gray-600">
              2 Projects Updated Today <span className="text-xs text-gray-500">Last update at 2:45 PM</span>
            </span>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="flex gap-4 md:hidden">
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <span className="text-sm font-semibold text-gray-900">4 Active Projects</span>
          </div>
          <div className="flex items-center gap-2">
            <MdFiberManualRecord className="h-2 w-2 text-primary" />
            <span className="text-sm font-semibold text-gray-900">2 Updated Today</span>
          </div>
        </div>
      </div>
    </header>
  )
}
