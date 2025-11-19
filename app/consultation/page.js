'use client'
import { useState } from 'react';
import ContactInformationPage from '@/components/ConsultationSteps/Step1';
import SchedulingPage from '@/components/ConsultationSteps/Step2';

export default function ConsultationForm() {
  const [currentPage, setCurrentPage] = useState('contact');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Step navigation component
  const StepButton = ({ stepNumber, label, currentStep }) => {
    const isActive = currentStep === stepNumber;
    const isCompleted = currentStep > stepNumber;
    
    return (
      <div className={`flex items-center transition-colors duration-200 ${
        isActive || isCompleted ? 'text-black' : 'text-gray-400'
      }`}>
        <div className={`
          md:w-7 md:h-7 w-5 h-5 rounded-full flex items-center justify-center font-bold
          ${isActive ? 'bg-amber-500 text-white' : ''}
          ${isCompleted ? 'bg-green-500 text-white' : ''}
          ${!isActive && !isCompleted ? 'bg-gray-200' : ''}
        `}>
          {isCompleted ? '✓' : stepNumber}
        </div>
        <span className={`md:ml-2 ml-1 font-semibold md:text-sm text-xs text-nowrap ${isActive ? 'text-amber-500' : ''}`}>
          {label}
        </span>
      </div>
    );
  };

  // Handle form submission and move to scheduling
  const handleContactSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/consultation/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setCurrentPage('scheduling');
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (e) {
      alert('Error submitting data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToContact = () => {
    setCurrentPage('contact');
  };

  const currentStep = currentPage === 'contact' ? 1 : 2;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6">
      {/* Header with steps */}
      <div className="flex md:flex-row max-md:space-y-4 flex-col max-w-7xl justify-between items-center w-full px-6 mb-8">
        <div className="bg-white px-4 py-2 rounded shadow flex items-center">
          <span className="text-amber-500 font-bold text-lg">i</span>
          <span className="text-black font-bold text-lg ml-1">SHELTER</span>
        </div>
        
        <div className="flex items-center space-x-6 md:space-x-6 bg-white py-2 px-4 rounded-xl text-sm">
          <StepButton stepNumber={1} label="Your Information" currentStep={currentStep} />
          <StepButton stepNumber={2} label="Book Appointment" currentStep={currentStep} />
        </div>
      </div>

      {/* Render current page */}
      {currentPage === 'contact' ? (
        <ContactInformationPage 
          onNext={handleContactSubmit}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
        />
      ) : (
        <SchedulingPage 
          onBack={handleBackToContact}
          bookingCompleted={bookingCompleted}
          setBookingCompleted={setBookingCompleted}
        />
      )}
    </div>
  );
}