import { FiPlus } from "react-icons/fi"
import SearchBar from "@/components/ui/SearchBar"
import FilterDropdown from "@/components/ui/FilterDropdown"

const UserTableHeader = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  statusFilter, 
  onStatusFilterChange, 
  onAddUser 
}) => {
  return (
    <div className="mb-6">
      <SearchBar 
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search users by name or email"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            options={["All Role", "Admin", "Project Manager", "Client"]}
          />
          <FilterDropdown
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            options={["All Status", "Active", "Inactive", "Suspended"]}
          />
        </div>

        <button 
          onClick={onAddUser}
          className="w-full sm:w-auto bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>
    </div>
  )
}

export default UserTableHeader