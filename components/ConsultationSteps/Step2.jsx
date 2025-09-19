import { FaArrowRight, FaClipboardList } from "react-icons/fa";
import { HiCheck } from "react-icons/hi";
import { FaCheck} from "react-icons/fa"


export default function Step2() {
   
  return (
 <>
 <div className="mt-28 bg-100 px-4">
    <div className="max-w-3xl mb-2">
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Choose Your Consultation Package</h1>
   <p className="text-center text-text text-base mb-8">
   Our consultation packages are designed to give you clarity, uncover hidden costs, and prepare 
   you for a smooth transition into full Design or Construction Management. These are not design 
   services, but pre-project advisory solutions that recover costs while giving you just enough 
   value to move forward confidently.
   </p>
    </div>
 </div>



 <div className="min-h-screen bg-gray-100 py-12 ">
      <div className="md:max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LandFit Consultation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
            {/* Starter Badge */}
            <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              STARTER
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">LandFit Consultation</h2>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-orange-500">$299</span>
              <span className="text-gray-500 ml-2">one-time</span>
            </div>

            {/* Tagline */}
            <p className="text-gray-600 italic text-lg mb-8">Is my land and idea viable?</p>

            {/* What You Get */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">What You Get:</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Compliance & Cost Awareness</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Space Analysis (High-Level)</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Proposed Layouts</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Design Direction</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advisory & Next Steps</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-colors">
              Select This Plan
              <FaArrowRight className="ml-2" />
            </button>
          </div>

          {/* BuildPath Consultation */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
              <div className="absolute top-6 right-[-32px] bg-purple-600 text-white px-8 py-1 text-sm font-semibold transform rotate-45 shadow-md">
                Best Value
              </div>
            </div>

            {/* Comprehensive Badge */}
            <div className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              COMPREHENSIVE
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">BuildPath Consultation</h2>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-purple-600">$498</span>
            </div>

            {/* Tagline */}
            <p className="text-gray-600 italic text-lg mb-8">What exactly must I do to start building?</p>

            {/* What You Get */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                  <span className="text-white text-sm">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">What You Get:</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">
                    <strong>Everything in LandFit</strong>, plus:
                  </span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Detailed Compliance Mapping</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Enhanced Space & Layout Advisory</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Stronger Design Preparation</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Decision-Ready Roadmap</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-colors">
              Select This Plan
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
   
   </>
  )
  }