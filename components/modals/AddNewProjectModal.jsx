"use client"
import { useState, useEffect } from "react"
import { FaCheck, FaTimes, FaChevronDown, FaArrowRight, FaArrowLeft, FaEdit } from "react-icons/fa"
import { addProjectToFirestore } from '@/utils/addProjectToFirestore'
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function AddNewProjectModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectManagers, setProjectManagers] = useState([])
  const [successManagers, setSuccessManagers] = useState([])
  const [showProjectManagerDropdown, setShowProjectManagerDropdown] = useState(false)
  const [showSuccessManagerDropdown, setShowSuccessManagerDropdown] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [formData, setFormData] = useState({
    projectName: "",
    shortDescription: "",
    projectAddress: "",
    projectManager: "",
    projectManagerId: "",
    successManagers: [],
    successManagerIds: [],
    consultationPlan: "standard",
    initialBudget: "",
    startDate: "",
    completionDate: "",
    sendNotification: true,
    projectStatus: "pending",
  })

  const steps = [
    { number: 1, label: "Project Details", sublabel: "Project & Client" },
    { number: 2, label: "Team & Financial", sublabel: "Team & Financial" },
    { number: 3, label: "Confirmation", sublabel: "Confirmation" },
  ]

  // Fetch users with project manager and success manager roles
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return
      
      setLoadingUsers(true)
      try {
        const usersRef = collection(db, 'users')
        
        // Fetch project managers
        const pmQuery = query(usersRef, where('role', '==', 'project manager'))
        const pmSnapshot = await getDocs(pmQuery)
        const pmList = pmSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProjectManagers(pmList)

        // Fetch success managers
        const smQuery = query(usersRef, where('role', '==', 'success manager'))
        const smSnapshot = await getDocs(smQuery)
        const smList = smSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setSuccessManagers(smList)

      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to load team members')
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    // Reset form when canceling
    setFormData({
      projectName: "",
      shortDescription: "",
      projectAddress: "",
      projectManager: "",
      projectManagerId: "",
      successManagers: [],
      successManagerIds: [],
      consultationPlan: "standard",
      initialBudget: "",
      startDate: "",
      completionDate: "",
      sendNotification: true,
      projectStatus: "pending",
    })
    setCurrentStep(1)
    setShowProjectManagerDropdown(false)
    setShowSuccessManagerDropdown(false)
    onClose()
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.projectName || !formData.projectAddress || !formData.projectManager) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      console.log('Submitting project data:', formData)
      await addProjectToFirestore(formData)
      toast.success('Project created successfully!')
      
      // Reset form and close modal
      setFormData({
        projectName: "",
        shortDescription: "",
        projectAddress: "",
        projectManager: "",
        projectManagerId: "",
        successManagers: [],
        successManagerIds: [],
        consultationPlan: "standard",
        initialBudget: "",
        startDate: "",
        completionDate: "",
        sendNotification: true,
        projectStatus: "pending",
      })
      setCurrentStep(1)
      setShowProjectManagerDropdown(false)
      setShowSuccessManagerDropdown(false)
      onClose()
    } catch (error) {
      console.error('Error adding project:', error)
      toast.error(`Failed to create project: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectProjectManager = (manager) => {
    setFormData({
      ...formData,
      projectManager: manager.displayName,
      projectManagerId: manager.id
    })
    setShowProjectManagerDropdown(false)
  }

  const selectSuccessManager = (manager) => {
    // Check if already selected
    if (!formData.successManagerIds.includes(manager.id)) {
      setFormData({
        ...formData,
        successManagers: [...formData.successManagers, manager.displayName],
        successManagerIds: [...formData.successManagerIds, manager.id]
      })
    }
    setShowSuccessManagerDropdown(false)
  }

  const removeSuccessManager = (managerName, managerId) => {
    setFormData({
      ...formData,
      successManagers: formData.successManagers.filter(name => name !== managerName),
      successManagerIds: formData.successManagerIds.filter(id => id !== managerId)
    })
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative mx-auto max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={handleCancel}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600"
          disabled={isSubmitting}
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Add New Project</h1>
        {currentStep === 1 && (
          <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 pr-8">
            Create a new project and assign team members to get started
          </p>
        )}

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 mt-4 sm:mt-6">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                    currentStep === step.number
                      ? "bg-orange-500 text-white"
                      : currentStep > step.number
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.number ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : step.number}
                </div>
                <span
                  className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center ${
                    currentStep === step.number ? "text-orange-500 font-medium" : "text-gray-400"
                  }`}
                >
                  {step.sublabel}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 sm:mx-2 ${currentStep > step.number ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Project & Client Details */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
              Project & Client Details
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Project Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Short Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Enter project description"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Project Address/Location<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.projectAddress}
                  onChange={(e) => setFormData({ ...formData, projectAddress: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter project address"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team & Financial */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
              Team Assignment
            </h2>

            <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
              {/* Project Manager Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Project Manager (PM)<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProjectManagerDropdown(!showProjectManagerDropdown)}
                    disabled={isSubmitting || loadingUsers}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      {formData.projectManager ? (
                        <>
                          <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-semibold flex items-center justify-center">
                            {getInitials(formData.projectManager)}
                          </div>
                          <span className="text-xs sm:text-sm text-gray-900">
                            {formData.projectManager}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-500">
                          {loadingUsers ? "Loading..." : "Select Project Manager"}
                        </span>
                      )}
                    </div>
                    <FaChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${showProjectManagerDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Project Manager Dropdown */}
                  {showProjectManagerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {projectManagers.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-500">
                          {loadingUsers ? "Loading project managers..." : "No project managers found"}
                        </div>
                      ) : (
                        projectManagers.map((manager) => (
                          <button
                            key={manager.id}
                            type="button"
                            onClick={() => selectProjectManager(manager)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-semibold flex items-center justify-center">
                              {getInitials(manager.displayName)}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm text-gray-900">{manager.displayName}</div>
                              <div className="text-[10px] text-gray-500">{manager.email}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Success Managers Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Success Managers
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSuccessManagerDropdown(!showSuccessManagerDropdown)}
                    disabled={isSubmitting || loadingUsers}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-xs sm:text-sm text-gray-500">
                      {loadingUsers ? "Loading..." : "Add Success Managers"}
                    </span>
                    <FaChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${showSuccessManagerDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Success Manager Dropdown */}
                  {showSuccessManagerDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {successManagers.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-gray-500">
                          {loadingUsers ? "Loading success managers..." : "No success managers found"}
                        </div>
                      ) : (
                        successManagers.map((manager) => (
                          <button
                            key={manager.id}
                            type="button"
                            onClick={() => selectSuccessManager(manager)}
                            disabled={formData.successManagerIds.includes(manager.id)}
                            className={`w-full px-3 py-2 text-left flex items-center gap-2 ${
                              formData.successManagerIds.includes(manager.id) 
                                ? 'bg-gray-100 opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs font-semibold flex items-center justify-center">
                              {getInitials(manager.displayName)}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm text-gray-900">{manager.displayName}</div>
                              <div className="text-[10px] text-gray-500">{manager.email}</div>
                            </div>
                            {formData.successManagerIds.includes(manager.id) && (
                              <FaCheck className="w-3 h-3 text-green-500 ml-auto" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected Success Managers */}
                <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[44px] mt-2">
                  {formData.successManagers.length > 0 ? (
                    formData.successManagers.map((manager, index) => (
                      <span
                        key={formData.successManagerIds[index]}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded"
                      >
                        {manager}
                        <button 
                          onClick={() => removeSuccessManager(manager, formData.successManagerIds[index])} 
                          className="text-blue-500 hover:text-blue-700"
                          disabled={isSubmitting}
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400">No success managers added</span>
                  )}
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Select success managers to assign to this project
                </p>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
              Financial & Timeline Setup
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Consultation Plan<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormData({ ...formData, consultationPlan: "standard" })}
                    disabled={isSubmitting}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.consultationPlan === "standard"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white"
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">Standard Plan</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">
                      Basic consultation services with regular check-ins and standard deliverables
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, consultationPlan: "premium" })}
                    disabled={isSubmitting}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      formData.consultationPlan === "premium"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white"
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">Premium Plan</div>
                    <div className="text-[10px] sm:text-xs text-gray-600">
                      Enhanced consultation with priority support, detailed analysis, and premium deliverables
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                  Initial Project Budget<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.initialBudget}
                  onChange={(e) => setFormData({ ...formData, initialBudget: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="2,500,000"
                  disabled={isSubmitting}
                />
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Enter the total estimated budget for this project in Nigerian Naira
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                    Expected Completion Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
              Review Project Details
            </h2>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Project Name</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.projectName || "Not provided"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(1)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Project Address</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.projectAddress || "Not provided"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(1)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Project Manager</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.projectManager || "Not assigned"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Success Managers</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.successManagers.length > 0 ? formData.successManagers.join(', ') : "None assigned"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Consultation Plan</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1 capitalize">
                      {formData.consultationPlan} Plan
                    </div>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Initial Project Budget</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.initialBudget ? `₦ ${formData.initialBudget}` : "Not set"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Start Date / Expected Completion</div>
                  <div className="flex items-start gap-2">
                    <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                      {formData.startDate && formData.completionDate
                        ? `${formatDate(formData.startDate)} / ${formatDate(formData.completionDate)}`
                        : "Not set"}
                    </div>
                    <button 
                      onClick={() => setCurrentStep(2)} 
                      className="text-orange-500 flex-shrink-0"
                      disabled={isSubmitting}
                    >
                      <FaEdit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
              Finalize Setup
            </h2>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start sm:items-center justify-between py-3 gap-3">
                <div className="text-xs sm:text-sm text-gray-900 flex-1">
                  Send Welcome Notification to Client and Project Manager
                </div>
                <button
                  onClick={() => setFormData({ ...formData, sendNotification: !formData.sendNotification })}
                  disabled={isSubmitting}
                  className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                    formData.sendNotification ? "bg-orange-500" : "bg-gray-300"
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.sendNotification ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-900 mb-3">Initial Project Status</div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => !isSubmitting && setFormData({ ...formData, projectStatus: "pending" })}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.projectStatus === "pending" ? "border-orange-500" : "border-gray-300"
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {formData.projectStatus === "pending" && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">Pending Kickoff</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => !isSubmitting && setFormData({ ...formData, projectStatus: "inProgress" })}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.projectStatus === "inProgress" ? "border-orange-500" : "border-gray-300"
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {formData.projectStatus === "inProgress" && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-700">In Progress</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          {currentStep === 1 ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
                disabled={isSubmitting}
              >
                Next Step
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </>
          ) : currentStep === 2 ? (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
                disabled={isSubmitting}
              >
                Next Step
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Creating...</span>
                      <span className="sm:hidden">Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Create Project & Finish</span>
                      <span className="sm:hidden">Create</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}