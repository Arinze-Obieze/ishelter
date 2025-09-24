'use client';
import Step1 from "@/components/ConsultationSteps/Step1";
import Step2 from "@/components/ConsultationSteps/Step2";
import Step3 from "@/components/ConsultationSteps/Step3";
import {  useState } from "react";
import toast from 'react-hot-toast';


export default function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: '',
  });
  const [registrationId, setRegistrationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Step 1: Save user info to DB
  const handleStep1Submit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) return;
    setIsSubmitting(true);
    try {
      let res, data;
      if (!registrationId) {
        // Create new registration
        res = await fetch('/api/consultation/registration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            ...formData, 
            plan: formData.plan || 'LandFit Consultation' 
          }),
        });
        data = await res.json();
        if (res.ok && data.id) {
          setRegistrationId(data.id);
        }
      } else {
        // Update existing registration
        res = await fetch('/api/consultation/registration', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            registrationId, 
            ...formData, 
            plan: formData.plan || 'LandFit Consultation',
            status: "pending_payment" 
          }),
        });
        data = await res.json();
      }
      if ((res.ok && (data.id || data.message))) {
        setStep(2);
      } else {
        toast.error(data.error || 'Submission failed');
      }
    } catch (e) {
      toast.error('Error submitting data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Select plan and update registration
  const handlePlanSelect = async (plan) => {
    if (!registrationId) return;
    setIsSubmitting(true);
    setFormData(prev => ({ ...prev, plan }));
    try {
      // Update all form data in DB
      const res = await fetch('/api/consultation/registration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          registrationId, 
          ...formData,
          plan,
          status: "pending_payment" 
        }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update plan');
      }
    } catch (e) {
      toast.error('Error updating plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Payment success handler
  const handlePaymentSuccess = async () => {
    if (!registrationId) return;
    setIsSubmitting(true);
    try {
      // Update all form data and mark as paid
      const res = await fetch('/api/consultation/registration', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          registrationId, 
          ...formData,
          status: 'paid' 
        }),
      });
      if (res.ok) {
        toast.success('Registration complete.');
        // Optionally redirect or reset form
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update payment status');
      }
    } catch (e) {
      toast.error('Error updating payment status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Step renderers
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1
            formData={formData}
            updateFormData={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
            onSubmit={handleStep1Submit}
            isSubmitting={isSubmitting}
          />
        );
      case 2:
        return (
          <Step2
            selectedPlan={formData.plan}
            onSelectPlan={handlePlanSelect}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      case 3:
        return (
          <Step3
            user={formData}
            amount={formData.plan === 'BuildPath Consultation' ? 498 : 299}
            email={formData.email}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            registrationId={registrationId}
          />
        );
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