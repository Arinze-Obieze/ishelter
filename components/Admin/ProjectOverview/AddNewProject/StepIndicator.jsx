import { FaCheck } from "react-icons/fa"

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8 mt-4 sm:mt-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                currentStep === step.number
                  ? "bg-orange-500 text-white"
                  : currentStep > step.number
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {currentStep > step.number ? <FaCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : step.number}
            </div>
            <span
              className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center ${
                currentStep === step.number ? "text-orange-500 font-medium" : "text-gray-400"
              }`}
            >
              {step.sublabel}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-1 sm:mx-2 ${
                currentStep > step.number ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}