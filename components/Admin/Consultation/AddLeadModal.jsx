// components/Admin/AddLeadModal.js
'use client'
import { useState, useEffect } from "react"
import { FiPlus, FiX } from "react-icons/fi"
import { toast } from 'react-hot-toast'

export default function AddLeadModal({ isOpen, onClose, onLeadAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "LandFit Consultation",
    notes: ""
  })
  const [errors, setErrors] = useState({})

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setErrors({})
    try {
      // 1. Add to consultation-registration via API
      const leadData = {
        email: formData.email,
        fullName: formData.name,
        phone: formData.phone,
        plan: formData.plan,
        status: "success",
        createdAt: new Date().toISOString(),
      }
      const regRes = await fetch("/api/consultation/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      })
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({}))
        throw new Error("Failed to save lead: " + (err.error || regRes.statusText))
      }

      // 2. Create Firebase user via API
      const createRes = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })
      const createData = await createRes.json().catch(() => ({}))
      if (!createRes.ok || !createData.success) {
        throw new Error("Failed to create user account: " + (createData.error || createRes.statusText))
      }

      // 3. Send login details via email
      const sendEmailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: formData.email,
          subject: "Your ishelter Login Details",
          message: `Hello ${formData.name},<br>Your account has been created.<br>Email: ${formData.email}<br>Password: ${createData.password}<br>Login at: <a href='https://ishelter.everythingshelter.com.ng/login'>ishelter.everythingshelter.com.ng/login</a>`
        }),
      })
      const sendEmailData = await sendEmailRes.json().catch(() => ({}))
      if(sendEmailRes.ok){
        toast.success("Login details sent to lead's email")
      }else{
        throw new Error("Failed to send login email: " + (sendEmailData.error || sendEmailRes.statusText))
      }
      
    

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        phone: "",
        plan: "LandFit Consultation",
        notes: ""
      })
      setErrors({})
      onLeadAdded && onLeadAdded(leadData)
      onClose()
    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed backdrop-overlay z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Frosted Glass Backdrop */}
      <div className="absolute " />
      
      {/* Modal Container */}
      <div className="relative bg-white bg-opacity-90 backdrop-blur-lg backdrop-filter rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-white border-opacity-20">
        {/* Enhanced Header with Glass Effect */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md border-b border-white border-opacity-20">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Lead</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-white hover:bg-opacity-50 backdrop-blur-sm"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto bg-transparent">
          {errors.submit && (
            <div className="bg-red-50 bg-opacity-80 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {errors.submit}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                errors.name ? 'border-red-300 bg-red-50 bg-opacity-50' : 'border-gray-300 bg-white bg-opacity-70'
              } backdrop-blur-sm`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                errors.email ? 'border-red-300 bg-red-50 bg-opacity-50' : 'border-gray-300 bg-white bg-opacity-70'
              } backdrop-blur-sm`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                errors.phone ? 'border-red-300 bg-red-50 bg-opacity-50' : 'border-gray-300 bg-white bg-opacity-70'
              } backdrop-blur-sm`}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-2">
              Requested Plan
            </label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white bg-opacity-70 backdrop-blur-sm"
            >
              <option value="LandFit Consultation">LandFit Consultation</option>
              <option value="BuildPath Consultation">BuildPath Consultation</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white bg-opacity-70 backdrop-blur-sm resize-none"
              placeholder="Any additional information..."
            />
          </div>
        </form>

        {/* Enhanced Footer with Glass Effect */}
        <div className="bg-white bg-opacity-70 backdrop-blur-md border-t border-white border-opacity-20">
          <div className="flex gap-3 justify-end p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-gray-700 bg-white bg-opacity-80 border border-gray-300 rounded-xl hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 backdrop-blur-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 flex items-center gap-2 font-medium shadow-lg shadow-orange-500/25"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  Add Lead
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}