"use client"
import { useState, useEffect } from "react"
import { toast } from 'react-hot-toast'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, doc } from 'firebase/firestore'
import { addProjectToFirestore } from '@/utils/addProjectToFirestore'
import { useQuery } from '@tanstack/react-query'
import { fetchProjectManagers } from '@/utils/queries/userQueries'
import StepIndicator from "../Admin/ProjectOverview/AddNewProject/StepIndicator"
import ModalContainer from "./ModalContainer"
import ModalHeader from "../Admin/ProjectOverview/AddNewProject/ModalHeader"
import Step1ProjectDetails from "../Admin/ProjectOverview/AddNewProject/Step1ProjectDetails"
import Step2TeamFinancial from "../Admin/ProjectOverview/AddNewProject/Step2TeamFinancial"
import Step3Confirmation from "../Admin/ProjectOverview/AddNewProject/Step3Confirmation"
import ModalFooter from "../Admin/ProjectOverview/AddNewProject/ModalFooter"



export default function AddNewProjectModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    projectName: "",
    shortDescription: "",
    projectAddress: "",
    projectManager: "",
    projectManagerId: "",
    consultationPlan: "standard",
    initialBudget: "",
    startDate: "",
    completionDate: "",
    sendNotification: true,
    projectStatus: "pending",
    projectUsers: [], // <-- use projectUsers, not projectUserIds
  })

  const steps = [
    { number: 1, label: "Project Details", sublabel: "Project & Client" },
    { number: 2, label: "Team & Financial", sublabel: "Team & Financial" },
    { number: 3, label: "Confirmation", sublabel: "Confirmation" },
  ]

  const { data: projectManagers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['projectManagers'],
    queryFn: fetchProjectManagers,
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })

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
      consultationPlan: "standard",
      initialBudget: "",
      startDate: "",
      completionDate: "",
      sendNotification: true,
      projectStatus: "pending",
      projectUsers: [], // <-- use projectUsers
    })
    setCurrentStep(1)
    onClose()
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.projectName || !formData.projectAddress || !formData.projectManagerId) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    try {
      // Build Firestore references
      const projectManagerRef = doc(db, 'users', formData.projectManagerId)
      // Use projectUsers directly (already DocumentReferences)
      const projectDataWithRefs = {
        ...formData,
        projectManager: projectManagerRef,
        // projectUsers is already an array of DocumentReferences
      }
      delete projectDataWithRefs.projectManagerId

      await addProjectToFirestore(projectDataWithRefs)
      toast.success('Project created successfully!')
      
      // Reset form and close modal
      setFormData({
        projectName: "",
        shortDescription: "",
        projectAddress: "",
        projectManager: "",
        projectManagerId: "",
        consultationPlan: "standard",
        initialBudget: "",
        startDate: "",
        completionDate: "",
        sendNotification: true,
        projectStatus: "pending",
        projectUsers: [],
      })
      setCurrentStep(1)
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
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (!isOpen) return null

  return (
    <ModalContainer onClose={handleCancel} isSubmitting={isSubmitting}>
      <ModalHeader 
        currentStep={currentStep} 
        title="Add New Project"
        description="Create a new project and assign team members to get started"
      />

      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="flex-1">
        {currentStep === 1 && (
          <Step1ProjectDetails 
            formData={formData} 
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        )}
        
        {currentStep === 2 && (
          <Step2TeamFinancial 
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            projectManagers={projectManagers}
            loadingUsers={loadingUsers}
            onSelectProjectManager={selectProjectManager}
          />
        )}
        
        {currentStep === 3 && (
          <Step3Confirmation 
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
            formatDate={formatDate}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>

      <ModalFooter
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </ModalContainer>
  )
}
