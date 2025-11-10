'use client';
import { FaUser, FaEnvelope, FaPhone, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

export default function Step1({ formData, updateFormData, onSubmit, isSubmitting }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
        {/* Form Section */}
        <div className="flex-1 max-w-2xl">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 relative">
            {/* Orange top border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-t-xl"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-2">
              Tell Us About Yourself
            </h2>
            <p className="text-gray-500 mb-6 text-base">
              To get started, please provide us with your contact information.
            </p>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUser size={18} />
                  </span>
                </div>
              </div>
              
              {/* Email Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope size={18} />
                  </span>
                </div>
              </div>
              
              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full border border-gray-300 bg-gray-50 rounded-lg py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="Enter your phone number"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaPhone size={18} />
                  </span>
                </div>
              </div>
              
              {/* Info Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start mt-2">
                <IoInformationCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-700 text-sm">
                  Your information is secure and will only be used to contact you about your consultation request.
                </span>
              </div>
              
              {/* Terms & Continue */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-500 text-sm text-center sm:text-left">
                  By continuing, you agree to our{' '}
                  <button type="button" className="text-orange-500 hover:text-orange-600 hover:underline font-medium">
                    Privacy Policy
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-orange-500 hover:text-orange-600 hover:underline font-medium">
                    Terms of Service
                  </button>
                </p>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <FaArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Info Sidebar */}
        <div className="bg-white rounded-xl shadow-md p-6 md:w-96">
          <h3 className="font-bold text-xl text-gray-900 mb-4">Why Request a Consultation?</h3>
          <p className="text-gray-500 mb-6">
            Our expert consultation provides valuable insights to help you make informed decisions about your construction project.
          </p>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <FaCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={18} />
              <span className="text-gray-700">Get expert guidance tailored to your specific construction needs</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={18} />
              <span className="text-gray-700">Understand potential costs and timelines before committing</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={18} />
              <span className="text-gray-700">Receive personalized recommendations based on your location and requirements</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={18} />
              <span className="text-gray-700">Explore various design options with professional feedback</span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-orange-500 mt-1 mr-3 flex-shrink-0" size={18} />
              <span className="text-gray-700">Identify potential challenges before they become costly problems</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

