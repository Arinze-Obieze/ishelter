"use client"

import { useState, useMemo } from "react"
import Header from "@/components/ProjectManager/Clients/Header"
import ClientsList from "@/components/ProjectManager/Clients/ClientList"
import ClientsTable from "@/components/ProjectManager/Clients/ClientTable"
import FilterTabs from "@/components/ProjectManager/Clients/FilterTabs"

const mockData = [
  {
    id: 1,
    name: "Sarah Mitchell",
    contact: { type: "phone", value: "(555) 234-5678" },
    projects: 5,
    value: "$287,450",
    status: "Active",
    lastActivity: "2 days ago",
  },
  {
    id: 2,
    name: "James Chen & Associates",
    contact: { type: "email", value: "jchen@associates.com" },
    projects: 3,
    value: "$156,200",
    status: "Active",
    lastActivity: "1 week ago",
  },
  {
    id: 3,
    name: "Riverside Development LLC",
    contact: { type: "phone", value: "(555) 789-0123" },
    projects: 2,
    value: "$94,300",
    status: "On Hold",
    lastActivity: "3 weeks ago",
  },
  {
    id: 4,
    name: "Thompson Family Trust",
    contact: { type: "phone", value: "(555) 345-6789" },
    projects: 4,
    value: "$223,800",
    status: "Active",
    lastActivity: "5 days ago",
  },
  {
    id: 5,
    name: "Martinez Construction",
    contact: { type: "phone", value: "(555) 456-7890" },
    projects: 1,
    value: "$45,600",
    status: "Archived",
    lastActivity: "4 months ago",
  },
  {
    id: 6,
    name: "Oakwood Properties",
    contact: { type: "email", value: "info@oakwoodprop.com" },
    projects: 2,
    value: "$112,500",
    status: "Active",
    lastActivity: "4 days ago",
  },
  {
    id: 7,
    name: "Diana Rodriguez",
    contact: { type: "phone", value: "(555) 567-8901" },
    projects: 1,
    value: "$68,900",
    status: "Active",
    lastActivity: "Yesterday",
  },
  {
    id: 8,
    name: "Westside Medical Center",
    contact: { type: "email", value: "facilities@westmed.org" },
    projects: 3,
    value: "$189,400",
    status: "Active",
    lastActivity: "3 days ago",
  },
  {
    id: 9,
    name: "Green Valley School District",
    contact: { type: "phone", value: "(555) 678-9012" },
    projects: 1,
    value: "$52,700",
    status: "On Hold",
    lastActivity: "2 months ago",
  },
  {
    id: 10,
    name: "Peterson & Lee Attorneys",
    contact: { type: "email", value: "admin@plattorneys.com" },
    projects: 2,
    value: "$134,200",
    status: "Active",
    lastActivity: "1 week ago",
  },
  {
    id: 11,
    name: "Anderson Construction",
    contact: { type: "phone", value: "(555) 123-4567" },
    projects: 3,
    value: "$156,200",
    status: "Active",
    lastActivity: "2 days ago",
  },
  {
    id: 12,
    name: "Summit Property Group",
    contact: { type: "phone", value: "(555) 987-6543" },
    projects: 2,
    value: "$245,800",
    status: "On Hold",
    lastActivity: "3 weeks ago",
  },
]

export default function MyClientsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [sortBy, setSortBy] = useState(null)

  const filteredData = useMemo(() => {
    let filtered = mockData

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
        const value = Number.parseInt(c.value.replace(/[$,]/g, ""))
        return value >= 150000
      })
    }

    return filtered
  }, [activeFilter])

  const handleSort = (column) => {
    setSortBy(column)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} totalCount={mockData.length} />

        {/* Mobile view */}
        <div className="block md:hidden">
          <ClientsList clients={filteredData} />
        </div>

        {/* Desktop view */}
        <div className="hidden md:block">
          <ClientsTable clients={filteredData} onSort={handleSort} sortBy={sortBy} />
        </div>
      </div>
    </main>
  )
}


