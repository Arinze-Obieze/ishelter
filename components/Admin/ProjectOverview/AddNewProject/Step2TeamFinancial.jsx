import UserDropdown from './UserDropdown'
import SuccessManagerTags from './SuccessManagerTags'
import FormField from './FormField'

export default function Step2TeamFinancial({
  formData,
  setFormData,
  isSubmitting,
  projectManagers,
  successManagers,
  loadingUsers,
  onSelectProjectManager,
  onSelectSuccessManager,
  onRemoveSuccessManager
}) {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
        Team Assignment
      </h2>

      <div className="space-y-4 sm:space-y-6 mb-4 sm:mb-6">
        {/* Project Manager Selection */}
        <FormField
          label="Project Manager (PM)"
          required
          input={
            <UserDropdown
              users={projectManagers}
              selectedUser={formData.projectManager}
              placeholder={loadingUsers ? "Loading..." : "Select Project Manager"}
              onSelectUser={onSelectProjectManager}
              isSubmitting={isSubmitting || loadingUsers}
              type="projectManager"
            />
          }
        />

        {/* Success Managers Selection */}
        <FormField
          label="Success Managers"
          input={
            <div>
              <UserDropdown
                users={successManagers}
                selectedUsers={formData.successManagers}
                selectedUserIds={formData.successManagerIds}
                placeholder={loadingUsers ? "Loading..." : "Add Success Managers"}
                onSelectUser={onSelectSuccessManager}
                isSubmitting={isSubmitting || loadingUsers}
                type="successManager"
              />
              
              <SuccessManagerTags
                successManagers={formData.successManagers}
                successManagerIds={formData.successManagerIds}
                onRemoveSuccessManager={onRemoveSuccessManager}
                isSubmitting={isSubmitting}
              />
              
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                Select success managers to assign to this project
              </p>
            </div>
          }
        />
      </div>

      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 pb-2 border-b-2 border-orange-500">
        Financial & Timeline Setup
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <FormField
          label="Consultation Plan"
          required
          input={
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
          }
        />

        <FormField
          label="Initial Project Budget"
          required
          input={
            <>
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
            </>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Start Date"
            required
            input={
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isSubmitting}
              />
            }
          />
          <FormField
            label="Expected Completion Date"
            required
            input={
              <input
                type="date"
                value={formData.completionDate}
                onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isSubmitting}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}