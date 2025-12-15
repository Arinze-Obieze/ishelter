import { FaEdit } from "react-icons/fa"
import FormField from './FormField'

export default function Step3Confirmation({ 
  formData, 
  setFormData, 
  isSubmitting, 
  formatDate, 
  setCurrentStep 
}) {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
        Review Project Details
      </h2>

      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ReviewField
            label="Project Name"
            value={formData.projectName || "Not provided"}
            onEdit={() => setCurrentStep(1)}
            isSubmitting={isSubmitting}
          />
          <ReviewField
            label="Project Address"
            value={formData.projectAddress || "Not provided"}
            onEdit={() => setCurrentStep(1)}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ReviewField
            label="Project Manager"
            value={formData.projectManager || "Not assigned"}
            onEdit={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ReviewField
            label="Consultation Plan"
            value={`${formData.consultationPlan} Plan`}
            onEdit={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
          <ReviewField
            label="Initial Project Budget"
            value={formData.initialBudget ? `₦ ${formData.initialBudget}` : "Not set"}
            onEdit={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <ReviewField
            label="Start Date / Expected Completion"
            value={
              formData.startDate && formData.completionDate
                ? `${formatDate(formData.startDate)} / ${formatDate(formData.completionDate)}`
                : "Not set"
            }
            onEdit={() => setCurrentStep(2)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
        Finalize Setup
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <ToggleField
          label="Send Welcome Notification to Client and Project Manager"
          checked={formData.sendNotification}
          onChange={(checked) => setFormData({ ...formData, sendNotification: checked })}
          isSubmitting={isSubmitting}
        />

        <RadioGroupField
          label="Initial Project Status"
          options={[
            { value: "pending", label: "Pending Kickoff" },
            { value: "inProgress", label: "In Progress" }
          ]}
          selectedValue={formData.projectStatus}
          onChange={(value) => setFormData({ ...formData, projectStatus: value })}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}

// Helper components for Step3
function ReviewField({ label, value, onEdit, isSubmitting }) {
  return (
    <div>
      <div className="text-[10px] sm:text-xs text-gray-500 mb-1">{label}</div>
      <div className="flex items-start gap-2">
        <div className="text-xs sm:text-sm text-gray-900 font-medium flex-1">
          {value}
        </div>
        <button 
          onClick={onEdit} 
          className="text-orange-500 flex-shrink-0"
          disabled={isSubmitting}
        >
          <FaEdit className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function ToggleField({ label, checked, onChange, isSubmitting }) {
  return (
    <div className="flex items-start sm:items-center justify-between py-3 gap-3">
      <div className="text-xs sm:text-sm text-gray-900 flex-1">{label}</div>
      <button
        onClick={() => onChange(!checked)}
        disabled={isSubmitting}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-orange-500" : "bg-gray-300"
        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}

function RadioGroupField({ label, options, selectedValue, onChange, isSubmitting }) {
  return (
    <div>
      <div className="text-xs sm:text-sm font-medium text-gray-900 mb-3">{label}</div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => !isSubmitting && onChange(option.value)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedValue === option.value ? "border-orange-500" : "border-gray-300"
              } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {selectedValue === option.value && <div className="w-3 h-3 rounded-full bg-orange-500" />}
            </div>
            <span className="text-xs sm:text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

