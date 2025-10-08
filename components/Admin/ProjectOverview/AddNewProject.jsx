"use client"

import { useState } from "react"
import { FaCheck, FaTimes, FaChevronDown, FaArrowRight, FaArrowLeft, FaEdit } from "react-icons/fa"

export default function AddNewProjectForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    projectName: "",
    shortDescription: "",
    projectAddress: "",
    projectManager: "",
    teamMembers: [],
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

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    console.log("Form cancelled")
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
  }

  const removeTeamMember = (member) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((m) => m !== member),
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 sm:p-6 relative mx-auto">
      {/* Close button */}
      <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600">
        <FaTimes className="w-5 h-5" />
      </button>

      {/* Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Add New Project</h1>
      {currentStep === 1 && (
        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 pr-8">
          Create a new project and assign team members to get started
        </p>
      )}

      {/* Step Indicator - Made responsive with smaller text on mobile */}
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
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                Project Manager (PM)<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-500 rounded text-white text-xs font-semibold flex items-center justify-center">
                      JD
                    </div>
                    <span className="text-xs sm:text-sm text-gray-900">
                      {formData.projectManager || "Select Project Manager"}
                    </span>
                  </div>
                  <FaChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Initial Team Members</label>
              <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[44px]">
                {formData.teamMembers.length > 0 ? (
                  formData.teamMembers.map((member) => (
                    <span
                      key={member}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded"
                    >
                      {member}
                      <button onClick={() => removeTeamMember(member)} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs sm:text-sm text-gray-400">No team members added</span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Search and select additional team members to assign to this project
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
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData.consultationPlan === "standard"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">Standard Plan</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">
                    Basic consultation services with regular check-ins and standard deliverables
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, consultationPlan: "premium" })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData.consultationPlan === "premium"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
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
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation - Now displays actual form data instead of hardcoded values */}
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
                  <button onClick={() => setCurrentStep(1)} className="text-orange-500 flex-shrink-0">
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
                  <button onClick={() => setCurrentStep(1)} className="text-orange-500 flex-shrink-0">
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
                  <button onClick={() => setCurrentStep(2)} className="text-orange-500 flex-shrink-0">
                    <FaEdit className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Consultation Plan</div>
                <div className="flex items-start gap-2">
                  <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1 capitalize">
                    {formData.consultationPlan} Plan
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-orange-500 flex-shrink-0">
                    <FaEdit className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Initial Project Budget</div>
                <div className="flex items-start gap-2">
                  <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                    {formData.initialBudget ? `₦ ${formData.initialBudget}` : "Not set"}
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-orange-500 flex-shrink-0">
                    <FaEdit className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-gray-500 mb-1">Start Date / Expected Completion</div>
                <div className="flex items-start gap-2">
                  <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
                    {formData.startDate && formData.completionDate
                      ? `${formatDate(formData.startDate)} / ${formatDate(formData.completionDate)}`
                      : "Not set"}
                  </div>
                  <button onClick={() => setCurrentStep(2)} className="text-orange-500 flex-shrink-0">
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
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                  formData.sendNotification ? "bg-orange-500" : "bg-gray-300"
                }`}
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
                    onClick={() => setFormData({ ...formData, projectStatus: "pending" })}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.projectStatus === "pending" ? "border-orange-500" : "border-gray-300"
                    }`}
                  >
                    {formData.projectStatus === "pending" && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">Pending Kickoff</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setFormData({ ...formData, projectStatus: "inProgress" })}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.projectStatus === "inProgress" ? "border-orange-500" : "border-gray-300"
                    }`}
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

      {/* Footer Buttons - Added Back button to step 2, made buttons responsive */}
      <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
        {currentStep === 1 ? (
          <>
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
            >
              <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
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
            >
              <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
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
            >
              Cancel
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:text-gray-900"
              >
                <FaArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
              >
                <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Project & Finish</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}