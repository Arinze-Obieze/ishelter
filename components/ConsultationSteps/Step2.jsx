'use client';
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { IoInformationCircleSharp } from "react-icons/io5";
import { FaArrowLeftLong, FaArrowRightLong, FaClipboardList } from "react-icons/fa6";

export default function Step2({ selectedPlan, onSelectPlan, onBack, isSubmitting }) {
  const handlePlanSelect = (plan) => {
    if (!isSubmitting) {
      onSelectPlan(plan);
    }
  };

  const handleContinue = () => {
    if (selectedPlan && !isSubmitting) {
      onSelectPlan(selectedPlan);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mt-12 mb-8">
        <h1 className="md:text-4xl text-3xl font-bold text-center text-primary mb-4">
          Choose Your Consultation Package
        </h1>
        <p className="text-center text-gray-600 md:text-base text-sm md:mb-8 mb-6 max-w-3xl mx-auto">
          Our consultation packages are designed to give you clarity, uncover hidden costs, and prepare 
          you for a smooth transition into full Design or Construction Management. These are not design 
          services, but pre-project advisory solutions that recover costs while giving you just enough 
          value to move forward confidently.
        </p>
      </div>

      <div className="bg-gray-100 rounded-xl md:py-8 py-6 px-4 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LandFit Consultation */}
          <div className={`bg-white rounded-2xl p-8 shadow-sm border ${
            selectedPlan === 'LandFit Consultation' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'
          } relative transition-all duration-200`}>
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              STARTER
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">LandFit Consultation</h2>

            <div className="mb-6">
              <span className="text-4xl font-bold text-orange-500">$299</span>
              <span className="text-gray-500 ml-2">one-time</span>
            </div>

            <p className="text-gray-600 italic text-lg mb-8">Is my land and idea viable?</p>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <FaClipboardList className="text-white text-sm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">What You Get:</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FaCheck className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Compliance & Cost Awareness</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Space Analysis (High-Level)</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Proposed Layouts</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Design Direction</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Advisory & Next Steps</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handlePlanSelect('LandFit Consultation')}
              disabled={isSubmitting}
              className={`w-full ${
                selectedPlan === 'LandFit Consultation' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              } font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50`}
            >
              {selectedPlan === 'LandFit Consultation' ? 'Selected' : 'Select This Plan'}
              {selectedPlan !== 'LandFit Consultation' && <FaArrowRight className="ml-2" />}
            </button>
          </div>

          {/* BuildPath Consultation */}
          <div className={`bg-white rounded-2xl p-8 shadow-sm border ${
            selectedPlan === 'BuildPath Consultation' ? 'border-purple-600 ring-2 ring-purple-200' : 'border-gray-200'
          } relative overflow-hidden transition-all duration-200`}>
            <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
              <div className="absolute top-6 right-[-32px] bg-purple-600 text-white px-8 py-1 text-sm font-semibold transform rotate-45 shadow-md">
                Best Value
              </div>
            </div>

            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              COMPREHENSIVE
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">BuildPath Consultation</h2>

            <div className="mb-6">
              <span className="text-4xl font-bold text-purple-600">$498</span>
            </div>

            <p className="text-gray-600 italic text-lg mb-8">What exactly must I do to start building?</p>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                  <FaClipboardList className="text-white text-sm" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">What You Get:</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <FaCheck className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Everything in LandFit</strong>, plus:
                  </span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Detailed Compliance Mapping</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Enhanced Space & Layout Advisory</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Stronger Design Preparation</span>
                </div>
                <div className="flex items-start">
                  <FaCheck className="text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Decision-Ready Roadmap</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handlePlanSelect('BuildPath Consultation')}
              disabled={isSubmitting}
              className={`w-full ${
                selectedPlan === 'BuildPath Consultation' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              } font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50`}
            >
              {selectedPlan === 'BuildPath Consultation' ? 'Selected' : 'Select This Plan'}
              {selectedPlan !== 'BuildPath Consultation' && <FaArrowRight className="ml-2" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 max-w-4xl mx-auto p-4 mb-8 flex items-start">
        <IoInformationCircleSharp className="text-amber-500 mr-2 text-2xl mt-0.5 flex-shrink-0"/>
        <p className="text-amber-800">
          These consultations are advisory and conceptual only. 
          Working drawings, structural designs, moodboards, and detailed BoQs are 
          only available in the Design Stage.
        </p>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto px-4">
        <button 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center bg-white border border-gray-300 rounded-lg px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <FaArrowLeftLong className="mr-2"/> 
          Back to Information
        </button>   

        <button 
          onClick={handleContinue}
          disabled={!selectedPlan || isSubmitting}
          className="flex items-center bg-gradient-to-r from-orange-400 to-orange-300 rounded-lg text-white px-5 py-3 font-medium hover:from-orange-500 hover:to-orange-400 disabled:opacity-50 transition-colors"
        >
          Continue to Payment
          <FaArrowRightLong className="ml-2"/> 
        </button>   
      </div>
    </div>
  );
}