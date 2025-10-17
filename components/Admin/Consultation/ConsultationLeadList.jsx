'use client'
import { useState, useEffect } from "react"
import { useConsultations } from '@/contexts/ConsultationContext'
import AddLeadModal from './AddLeadModal'
import LeadTable from './LeadTable'
import LeadFilters from './LeadFilters'
import LeadPagination from './LeadPagination'
import ErrorState from './utilities/ErrorState'
import LoadingState from "./utilities/LoadingState"

export default function ConsultationLeadList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [assignedSMFilter, setAssignedSMFilter] = useState("ALL")
  const [planFilter, setPlanFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { consultations, loading, error } = useConsultations();

  // Transform consultations to leads format
  const leads = consultations.map(consultation => ({
    id: consultation.id,
    name: consultation.fullName || consultation.name || 'N/A',
    email: consultation.email || 'N/A',
    phone: consultation.phone || 'N/A',
    plan: consultation.plan || 'LandFit Consultation',
    payment: consultation.status === 'success' ? 'success' : 
             consultation.status === 'pending' ? 'pending' : 
             consultation.status || 'NEW',
    assignedSM: consultation.assignedSM || null,
    submissionDate: consultation.createdAt ? 
      new Date(consultation.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }) : 'N/A',
    _original: consultation
  }));

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLeadAdded = () => {
    setCurrentPage(1)
  }

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === "" || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.assignedSM && lead.assignedSM.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "ALL" || lead.payment === statusFilter
    const matchesAssignedSM = assignedSMFilter === "ALL" || 
      (assignedSMFilter === "UNASSIGNED" ? !lead.assignedSM : lead.assignedSM === assignedSMFilter)
    const matchesPlan = planFilter === "ALL" || lead.plan === planFilter
    const matchesDate = dateFilter === "ALL"

    return matchesSearch && matchesStatus && matchesAssignedSM && matchesPlan && matchesDate
  })

  // Pagination data
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLeads = filteredLeads.slice(indexOfFirstItem, indexOfLastItem)

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-2">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <LeadFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            assignedSMFilter={assignedSMFilter}
            setAssignedSMFilter={setAssignedSMFilter}
            planFilter={planFilter}
            setPlanFilter={setPlanFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            setIsModalOpen={setIsModalOpen}
          />
        </div>

        {/* Table */}
        <LeadTable 
          leads={currentLeads}
          windowWidth={windowWidth}
          filteredLeadsCount={filteredLeads.length}
        />

        {/* Pagination */}
        {filteredLeads.length > 0 && (
          <LeadPagination 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            filteredLeads={filteredLeads}
          />
        )}
      </div>

      {/* Add Lead Modal */}
      <AddLeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLeadAdded={handleLeadAdded}
      />
    </div>
  )
}