'use client';
import Step1 from "@/components/ConsultationSteps/Step1";
import Step2 from "@/components/ConsultationSteps/Step2";
import { useState } from "react";

export default function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitFormData = async (data) => {
    try {
      // Submit to Firebase
      const response = await fetch('/api/submit-consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Data submitted successfully');
        setStep(2); 
      } else {
        console.error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 
                 formData={formData} 
                 updateFormData={updateFormData} 
                 onSubmit={() => handleSubmitFormData(formData)}
               />;
      case 2:
        return <Step2 />;
      case 3:
        return <div>Step 3 Content</div>;
      default:
        return null;
    }
  };

  const StepButton = ({ stepNumber, label }) => {
    const isActive = step === stepNumber;
    const isCompleted = step > stepNumber;
    
    return (
      <div 
        className={`flex items-center cursor-pointer transition-colors duration-200 ${
          isActive || isCompleted ? 'text-black' : 'text-gray-400'
        }`}
        onClick={() => setStep(stepNumber)}
      >
        <div className={`
          md:w-7 md:h-7  w-5 h-5 rounded-full flex items-center justify-center font-bold
          ${isActive ? 'bg-primary text-white' : ''}
          ${isCompleted ? 'bg-green-500 text-white' : ''}
          ${!isActive && !isCompleted ? 'bg-background' : ''}
        `}>
          {isCompleted ? '✓' : stepNumber}
        </div>
        <span className={`md:ml-2 ml-1 font-semibold md:text-sm text-xs text-nowrap ${isActive ? 'text-primary' : ''}`}>
          {label}
        </span>
      </div>
    ); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6">
      {/* Header */}
      <div className="flex md:flex-row max-md:space-y-4 flex-col max-w-7xl justify-between items-center w-full px-6 mb-8">
        <div className="bg-white px-4 py-2 rounded shadow flex items-center">
          <span className="text-primary font-bold text-lg">i</span>
          <span className="text-black font-bold text-lg ml-1">SHELTER</span>
        </div>
        
        <div className="flex items-center space-x-6 md:space-x-6 bg-white py-2 px-1 md:px-4 rounded-xl text-sm">
          <StepButton stepNumber={1} label="Your Information" />
          <StepButton stepNumber={2} label="Select Plan" />
          <StepButton stepNumber={3} label="Payment" />
        </div>
      </div>

      {renderStep()}
    </div>
  );
}