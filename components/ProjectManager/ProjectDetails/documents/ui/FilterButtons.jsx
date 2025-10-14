import { IoChevronDown } from "react-icons/io5";
import { filterOptions } from '@/utils/DocumentUtils';

export const FilterButtons = () => {
  return (
    <>
      {/* Mobile Filters */}
      <div className="flex gap-3 lg:hidden">
        {filterOptions.slice(0, 2).map((filter) => (
          <button 
            key={filter.key}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 min-w-0"
          >
            <span className="truncate">{filter.label}</span>
            <IoChevronDown className="w-4 h-4 flex-shrink-0" />
          </button>
        ))}
      </div>
      
      {/* Desktop Filters */}
      <div className="hidden lg:flex gap-4">
        {filterOptions.map((filter) => (
          <button 
            key={filter.key}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 whitespace-nowrap"
          >
            {filter.label}
            <IoChevronDown className="w-4 h-4" />
          </button>
        ))}
      </div>
    </>
  );
};