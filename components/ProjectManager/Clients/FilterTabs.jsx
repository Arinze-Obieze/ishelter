"use client"

export default function FilterTabs({ activeFilter, onFilterChange, totalCount, filteredCount }) {
  const filters = ["All", "Active", "On Hold", "Archived", "2+ Projects", "High Value"]

  return (
    <div className="mb-6 space-y-2">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 sm:gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-orange-500 text-white"
                : filter === "All"
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="hidden text-right text-sm text-gray-600 md:block">
        Showing {filteredCount || 0} of {totalCount} clients
      </div>
    </div>
  )
}