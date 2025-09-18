"use client"

import { useState } from "react"
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaHome, FaGlobe, FaCode, FaCheck } from "react-icons/fa"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "At least one uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "At least one number", met: /\d/.test(formData.password) },
    { text: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
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
          <button className="text-orange-500 text-sm font-medium flex items-center space-x-1">
            <span>Log In</span>
            <span>→</span>
          </button>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Your Account</h1>
          <p className="text-gray-600">
            Manage your construction project with expert guidance, from anywhere in the world.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors">
            <FaGoogle className="text-red-500" />
            <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
          </button>
          <button className="flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors">
            <FaFacebook className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Sign up with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or continue with email</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form className="space-y-6 flex-1">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="mt-3 space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}></div>
                  <span className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}>{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">What best describes you?</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSelectedRole("local")}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  selectedRole === "local" ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FaHome className="mx-auto mb-2 text-2xl text-orange-500" />
                <div className="font-medium text-gray-800">Local Client</div>
                <div className="text-xs text-gray-500 mt-1">I'm based in Nigeria</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("diaspora")}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  selectedRole === "diaspora"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FaGlobe className="mx-auto mb-2 text-2xl text-orange-500" />
                <div className="font-medium text-gray-800">Diaspora Client</div>
                <div className="text-xs text-gray-500 mt-1">I'm based abroad</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("developer")}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  selectedRole === "developer"
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FaCode className="mx-auto mb-2 text-2xl text-orange-500" />
                <div className="font-medium text-gray-800">Developer</div>
                <div className="text-xs text-gray-500 mt-1">Real estate developer</div>
              </button>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Create Account
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-500 hover:underline">
              Privacy Policy
            </a>
            . Your data is secure with us.
          </p>
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

            <h2 className="text-4xl font-bold mb-4">Building Dreams, Remotely</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of clients who trust iSHELTER to manage their construction projects remotely with expert
              guidance and transparency.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Real-time project monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Vetted professionals and contractors</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Expert guidance through regulatory processes</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCheck className="text-white bg-orange-600 rounded-full p-1 text-sm" />
                <span>Quality assurance checks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Construction imagery overlay */}
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-orange-600/30 to-transparent"></div>
      </div>
    </div>
  )
}
