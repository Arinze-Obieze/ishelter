export default function ModalHeader({ currentStep, title, description }) {
    return (
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {currentStep === 1 && (
          <p className="text-xs sm:text-sm text-gray-500 pr-8">{description}</p>
        )}
      </div>
    )
  }