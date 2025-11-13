"use client"

import { useState, useMemo } from "react"
import Header from "@/components/ProjectManager/Clients/Header"
import ClientsList from "@/components/ProjectManager/Clients/ClientList"
import ClientsTable from "@/components/ProjectManager/Clients/ClientTable"
import FilterTabs from "@/components/ProjectManager/Clients/FilterTabs"
import { useClients } from "@/contexts/ClientsContext"

export default function MyClientsPage() {
  const { clients, loading, error } = useClients()
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  const filteredData = useMemo(() => {
    let filtered = [...clients]

    // Apply filters
    if (activeFilter === "Active") {
      filtered = filtered.filter((c) => c.status === "Active")
    } else if (activeFilter === "On Hold") {
      filtered = filtered.filter((c) => c.status === "On Hold")
    } else if (activeFilter === "Archived") {
      filtered = filtered.filter((c) => c.status === "Archived")
    } else if (activeFilter === "2+ Projects") {
      filtered = filtered.filter((c) => c.projects >= 2)
    } else if (activeFilter === "High Value") {
      filtered = filtered.filter((c) => {
        const value = parseInt(c.value.replace(/[₦,]/g, ""))
        return value >= 150000
      })
    }

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let aVal, bVal

        switch (sortBy) {
          case "name":
            aVal = a.name.toLowerCase()
            bVal = b.name.toLowerCase()
            break
          case "projects":
            aVal = a.projects
            bVal = b.projects
            break
          case "value":
            aVal = parseInt(a.value.replace(/[₦,]/g, ""))
            bVal = parseInt(b.value.replace(/[₦,]/g, ""))
            break
          case "status":
            aVal = a.status
            bVal = b.status
            break
          case "lastActivity":
            // Sort by timestamp for accurate ordering
            aVal = a.lastLoginTimestamp?.toMillis?.() || 0
            bVal = b.lastLoginTimestamp?.toMillis?.() || 0
            break
          default:
            return 0
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [clients, activeFilter, sortBy, sortDirection])

  const handleSort = (column) => {
    if (sortBy === column) {
      // Toggle direction if clicking same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // New column, default to ascending
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading clients...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-semibold">Error loading clients</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
          totalCount={clients.length}
          filteredCount={filteredData.length}
        />

        {filteredData.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-gray-600">No clients found matching your filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="block md:hidden">
              <ClientsList clients={filteredData} />
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">
              <ClientsTable 
                clients={filteredData} 
                onSort={handleSort} 
                sortBy={sortBy}
                sortDirection={sortDirection}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}