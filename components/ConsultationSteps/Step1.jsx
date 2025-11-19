'use client'
import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

export default function ContactInformationPage({ onNext, formData, setFormData, isSubmitting }) {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      
      if (!/^[\+]?[0-9\s\-\(\)]{8,15}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (8-15 digits)';
      } else if (cleanPhone.length < 8 || cleanPhone.length > 15) {
        newErrors.phone = 'Phone number should be between 8-15 digits';
      } else if (!/^[\+]?[0-9]+$/.test(cleanPhone)) {
        newErrors.phone = 'Phone number can only contain numbers and optional + sign';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d+\-\s\(\)]/g, '');
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const InputField = ({ 
    label, 
    type, 
    value, 
    onChange, 
    placeholder, 
    icon: Icon, 
    error,
    customOnChange
  }) => (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={customOnChange || onChange}
          className={`w-full border rounded-lg py-3 pl-4 pr-12 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
          }`}
          placeholder={placeholder}
        />
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon size={18} />
        </span>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 flex items-center">
        <IoInformationCircle className="w-4 h-4 mr-1" />
        {error}
      </p>}
    </div>
  );

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onNext();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-8 justify-center mt-8">
        <div className="flex-1 max-w-2xl">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-amber-300 rounded-t-xl"></div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-2">
              Tell Us About Yourself
            </h2>
            <p className="text-gray-500 mb-6 text-base">
              To get started, please provide us with your contact information.
            </p>
            
            <div className="space-y-5">
              <InputField
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
                icon={FaUser}
                error={errors.fullName}
              />
              
              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
                icon={FaEnvelope}
                error={errors.email}
              />
              
              <InputField
                label="Phone Number"
                type="tel"
                value={formData.phone}
                customOnChange={handlePhoneChange}
                placeholder="e.g., 09161597308 or +2348161597308"
                icon={FaPhone}
                error={errors.phone}
              />
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start mt-2">
                <IoInformationCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-700 text-sm">
                  Your information is secure and will only be used to contact you about your consultation request.
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-500 text-sm text-center sm:text-left">
                  By continuing, you agree to our{' '}
                  <button type="button" className="text-amber-500 hover:text-amber-600 hover:underline font-medium">
                    Privacy Policy
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-amber-500 hover:text-amber-600 hover:underline font-medium">
                    Terms of Service
                  </button>
                </p>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.fullName || !formData.email || !formData.phone}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg px-6 py-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
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
            </div>
          </div>
        </div>
        
        <BenefitsSidebar />
      </div>
    </div>
  );
}

const BenefitsSidebar = () => (
  <div className="bg-white rounded-xl shadow-md p-6 md:w-96">
    <h3 className="font-bold text-xl text-gray-900 mb-4">Why Request a Consultation?</h3>
    <p className="text-gray-500 mb-6">
      Our expert consultation provides valuable insights to help you make informed decisions about your construction project.
    </p>
    
    <ul className="space-y-4">
      <li className="flex items-start">
        <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
        <span className="text-gray-700">Get expert guidance tailored to your specific construction needs</span>
      </li>
      <li className="flex items-start">
        <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
        <span className="text-gray-700">Understand potential costs and timelines before committing</span>
      </li>
      <li className="flex items-start">
        <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
        <span className="text-gray-700">Receive personalized recommendations based on your location and requirements</span>
      </li>
      <li className="flex items-start">
        <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
        <span className="text-gray-700">Explore various design options with professional feedback</span>
      </li>
      <li className="flex items-start">
        <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
        <span className="text-gray-700">Identify potential challenges before they become costly problems</span>
      </li>
    </ul>
  </div>
);