'use client';
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaCircle, FaArrowRight } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

export default function Step1({ formData, updateFormData, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div className="flex w-full space-x-12 justify-center">
        {/* Form Section */}
        <div className="flex items-center justify-center py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 w-full border border-gray-100 mt-2 relative">
            {/* Orange top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-200 rounded-t-xl"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1 mt-4">
              Tell Us About Yourself
            </h2>
            <p className="text-gray-500 mb-6 text-base">
              To get started, please provide us with your contact information.
            </p>
            <form className="space-y-4 z-10" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-md py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder=""
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaUser size={20} />
                  </span>
                </div>
              </div>
              {/* Email Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-md py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder=""
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaEnvelope size={20} />
                  </span>
                </div>
              </div>
              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-md py-3 pl-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder=""
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FaPhone size={20} />
                  </span>
                </div>
              </div>
              {/* Info Notice */}
              <div className="bg-green-100 border border-green-200 rounded-md px-4 py-3 flex items-center mt-2">
                <IoInformationCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 text-sm">
                  Your information is secure and will only be used to contact you about your consultation request.
                </span>
              </div>
              {/* Terms & Continue */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-sm">
                  By continuing, you agree to our
                  <span className="text-orange-400 mx-1 hover:underline cursor-pointer">Privacy Policy</span>
                  and
                  <span className="text-orange-400 mx-1 hover:underline cursor-pointer">Terms of Service</span>
                </span>
                <button
                  type="submit"
                  className="bg-primary hover:bg-orange-400 text-white font-semibold rounded-md px-6 py-2 transition shadow disabled:opacity-60 flex items-center"
                >
                  Continue
                  <FaArrowRight  className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Info Sidebar */}
        <div className="bg-white rounded-lg shadow-md p-6 m-9 w-96 ">
          <h3 className="font-bold text-xl text-gray-900 mb-3">Why Request a Consultation?</h3>
          <p className="text-gray-500 mb-4">
            Our expert consultation provides valuable insights to help you make informed decisions.
          </p>
          <ul className="list-none space-y-3">
            <li className="flex items-start">
              <span className="text-primary mt-1 mr-2">
                <FaCircle className="w-3 h-3 " />
              </span>
              <span className="text-gray-700">Get expert guidance tailored to your specific construction needs</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mt-1 mr-2">
                <FaCircle className="w-3 h-3" />
              </span>
              <span className="text-gray-700">Understand potential costs and timelines before committing</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mt-1 mr-2">
                <FaCircle className="w-3 h-3" />
              </span>
              <span className="text-gray-700">Receive personalized recommendations based on your location and requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mt-1 mr-2">
                <FaCircle className="w-3 h-3" />
              </span>
              <span className="text-gray-700">Explore various design options with professional feedback</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}