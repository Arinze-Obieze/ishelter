import { FiSearch, FiPlus, FiChevronDown } from "react-icons/fi"

export default function LeadFilters({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  statusFilter,
  setStatusFilter,
  assignedSMFilter,
  setAssignedSMFilter,
  planFilter,
  setPlanFilter,
  dateFilter,
  setDateFilter,
  setIsModalOpen
}) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lead by name, email or SM"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus className="w-4 h-4" />
          Add New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        <FilterSelect 
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          options={[
            { value: "ALL", label: "Status: All" },
            { value: "NEW", label: "New" },
            { value: "ASSIGNED", label: "Assigned" },
            { value: "success", label: "Success" },
            { value: "pending", label: "Pending" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" }
          ]}
        />

        <FilterSelect 
          value={assignedSMFilter}
          onChange={(e) => {
            setAssignedSMFilter(e.target.value)
            setCurrentPage(1)
          }}
          options={[
            { value: "ALL", label: "Assigned SM: All" },
            { value: "UNASSIGNED", label: "Unassigned" },
            { value: "Sarah Parker", label: "Sarah Parker" },
            { value: "John Smith", label: "John Smith" },
            { value: "Mike Johnson", label: "Mike Johnson" }
          ]}
        />

        <FilterSelect 
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value)
            setCurrentPage(1)
          }}
          options={[
            { value: "ALL", label: "Plan: All" },
            { value: "LandFit Consultation", label: "LandFit" },
            { value: "BuildPath Consultation", label: "BuildPath" }
          ]}
        />

        <FilterSelect 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          options={[
            { value: "ALL", label: "Date: All time" },
            { value: "TODAY", label: "Today" },
            { value: "WEEK", label: "This Week" },
            { value: "MONTH", label: "This Month" }
          ]}
        />
      </div>
    </>
  )
}

// Reusable Filter Select Component
function FilterSelect({ value, onChange, options }) {
  return (
    <div className="relative min-w-[120px] flex-1 sm:flex-none">
      <select 
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
    </div>
  )
}