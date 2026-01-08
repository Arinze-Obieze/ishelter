import { useState } from "react"
import { FiX } from "react-icons/fi"
import { useUsers } from "@/contexts/UserContext"
import { useCsrf } from "@/contexts/CsrfContext"
import { notifyProjectManagerAssignment, notifyClientsOfNewPM } from '@/utils/notifications'

const AddUserModal = ({ isOpen, onClose, isSubmitting }) => {
  const { users, currentUser } = useUsers() // Get currentUser from context
  const { getToken: getCsrfToken } = useCsrf()
  const [newUser, setNewUser] = useState({
    email: "",
    displayName: "",
    role: "client",
    projectManagerId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Filter users to get only project managers
  const projectManagers = users.filter(user => user.role === "project manager")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (role) => {
    setNewUser(prev => ({ 
      ...prev, 
      role: role.toLowerCase(),
      // Reset project manager selection if role changes away from client
      projectManagerId: role.toLowerCase() === "client" ? prev.projectManagerId : ""
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      // 1. Create account in Firebase Auth and Firestore
      const payload = { 
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role
      }

      // Only add projectManagerId if role is client and a PM is selected
      if (newUser.role === "client" && newUser.projectManagerId) {
        payload.projectManagerId = newUser.projectManagerId
      }

      const token = await currentUser.getIdToken()
      const csrfToken = getCsrfToken()

      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || "Account creation failed")

      // SEND NOTIFICATIONS FOR PM ASSIGNMENT
      if (newUser.role === "client" && newUser.projectManagerId && currentUser) {
        try {
          const selectedPM = projectManagers.find(pm => pm.id === newUser.projectManagerId)
          
          // Notify the Project Manager
          await notifyProjectManagerAssignment({
            projectId: null, // No specific project for user-level assignment
            projectManagerId: newUser.projectManagerId,
            assignedById: currentUser.id || currentUser.uid,
            assignedByName: currentUser.displayName || currentUser.name || currentUser.email || 'Admin'
          })

          // Notify the client about their PM
          await notifyClientsOfNewPM({
            projectId: null, // No specific project for user-level assignment
            projectManagerId: newUser.projectManagerId,
            projectManagerName: selectedPM?.displayName || selectedPM?.name || selectedPM?.email || 'Your Project Manager',
            assignedById: currentUser.id || currentUser.uid
          })

          console.log('✅ PM assignment notifications sent successfully')
        } catch (notificationError) {
          console.error('❌ Failed to send PM assignment notifications:', notificationError)
          // Don't throw - user was created successfully, notifications are secondary
        }
      }

      // 2. Send email
      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: newUser.email,
          subject: "Your ishelter account is ready!",
          name: newUser.displayName || newUser.email,
          message: `Hello ${newUser.displayName || newUser.email},<br>Your account has been created.<br>Email: ${newUser.email}<br>Password: ${data.password}<br>Please login and change your password.`
        })
      })
      const emailData = await emailRes.json()
      if (!emailData.success) throw new Error(emailData.error || "Email sending failed")

      setSuccess("User account created and email sent!")
      setNewUser({ email: "", displayName: "", role: "client", projectManagerId: "" })
      onClose() // Close modal on success
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setNewUser({ email: "", displayName: "", role: "client", projectManagerId: "" })
    setError("")
    setSuccess("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={newUser.displayName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Admin", "Project Manager", "Client"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    newUser.role === role.toLowerCase()
                      ? "bg-orange-100 border-orange-500 text-orange-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Project Manager Selection - Only show for Client role */}
          {newUser.role === "client" && (
            <div>
              <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Project Manager (Optional)
              </label>
              <select
                id="projectManager"
                name="projectManagerId"
                value={newUser.projectManagerId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">-- Select Project Manager --</option>
                {projectManagers.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.displayName || pm.email}
                  </option>
                ))}
              </select>
              {projectManagers.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No project managers available</p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newUser.email}
              className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal

