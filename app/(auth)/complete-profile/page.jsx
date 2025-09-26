"use client"
import {useState, useEffect} from "react"
import { useRouter } from "next/navigation"
import { FaCheck, FaUser, FaGlobeAmericas, FaHardHat, FaArrowRight } from "react-icons/fa"

function CompleteProfileInner() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Pre-filled with already collected data
  const [formData, setFormData] = useState({
    email: "user@example.com", // This would come from props or context
    phoneNumber: "+234 XXX XXX XXXX", // This would come from props or context
    fullName: "John Doe", // This would come from props or context
    role: "" // local, diaspora, or developer
  })

  useEffect(() => {
    // In a real app, you would get this data from authentication context or props
    // For demo purposes, we're using placeholder values
  }, [])

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role })
    setError("") 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!formData.role) {
      setError("Please select what best describes you")
      return
    }

    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would make an API call to update the user's profile
      console.log("Profile data to save:", formData)
      
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard") // Redirect to dashboard after completion
      }, 2000)
    } catch (err) {
      setError("Failed to complete profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    {
      value: "local",
      label: "Local Client",
      description: "I'm based in Nigeria",
      icon: FaUser,
      color: "from-blue-500 to-blue-600"
    },
    {
      value: "diaspora",
      label: "Diaspora Client",
      description: "I'm based abroad",
      icon: FaGlobeAmericas,
      color: "from-green-500 to-green-600"
    },
    {
      value: "developer",
      label: "Developer",
      description: "Real estate developer",
      icon: FaHardHat,
      color: "from-purple-500 to-purple-600"
    }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
            <span className="text-xl font-bold text-gray-800">iSHELTER</span>
          </div>
          <div className="text-sm text-gray-500">Welcome!</div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 mb-6">
            <div className="flex items-center">
              <FaCheck className="text-orange-500 mr-2" />
              <span className="text-orange-700 font-medium">Successfully logged in!</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Just One More Step</h1>
          <p className="text-gray-600 mb-2">
            Welcome to iSHELTER! We're excited to have you on board.
          </p>
          <p className="text-gray-600">
            To give you the best experience, please tell us a bit more about yourself. This helps us personalize your dashboard and show you relevant features.
          </p>
        </div>

        {/* Already Collected Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-gray-700 mb-3">Your account information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Full Name:</span>
              <div className="font-medium text-gray-800">{formData.fullName}</div>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <div className="font-medium text-gray-800">{formData.email}</div>
            </div>
            <div>
              <span className="text-gray-500">Phone Number:</span>
              <div className="font-medium text-gray-800">{formData.phoneNumber}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            ✓ This information was collected during registration
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 flex-1">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Which category best describes you? <span className="text-orange-500">*</span>
            </label>
            <p className="text-gray-600 text-sm mb-4">
              This helps us tailor the platform to your specific needs and show you the most relevant features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = formData.role === option.value
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleRoleSelect(option.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      isSelected 
                        ? "border-orange-500 bg-orange-50 shadow-sm" 
                        : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color} text-white`}>
                        <IconComponent className="text-sm" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">{option.label}</span>
                        <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex justify-end mt-2">
                        <FaCheck className="text-orange-500 text-sm" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-600 text-sm flex items-center">
                <FaCheck className="mr-2 text-red-500" />
                {error}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-600 text-sm flex items-center">
                <FaCheck className="mr-2 text-green-500" />
                Perfect! Your profile is now complete. Taking you to your dashboard...
              </div>
            </div>
          )}

          {/* Complete Profile Button */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || !formData.role}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving your preferences...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup & Continue</span>
                  <FaArrowRight className="text-sm" />
                </>
              )}
            </button>

            {/* Skip for now option */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                I'll set this up later - take me to my dashboard
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Right Side - Hero Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 to-yellow-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-4 h-4 bg-orange-600 rounded-full"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-orange-600 rounded-full"></div>
          <div className="absolute bottom-32 left-16 w-2 h-2 bg-orange-600 rounded-full"></div>
          <div className="absolute bottom-20 right-32 w-5 h-5 bg-orange-600 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-orange-600 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-orange-600 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col justify-center text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded"></div>
              <span className="text-2xl font-bold">SHELTER</span>
            </div>

            <h2 className="text-4xl font-bold mb-4">Personalized Experience Ahead</h2>
            <p className="text-lg mb-8 opacity-90">
              By telling us about yourself, we can customize iSHELTER to match your specific needs and goals.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>See projects and features relevant to you</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Get tailored recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Connect with the right professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Access location-specific resources</span>
              </div>
            </div>
          </div>

          {/* Quick tip */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-8">
            <p className="text-sm opacity-90">
              <strong>Tip:</strong> You can always update this information later in your profile settings.
            </p>
          </div>
        </div>

        {/* Construction imagery overlay */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-600/30 to-transparent"></div>
      </div>
    </div>
  )
}

export default function CompleteProfilePage() {
  return (
      <CompleteProfileInner />
  )
}