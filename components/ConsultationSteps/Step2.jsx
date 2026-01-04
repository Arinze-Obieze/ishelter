'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

const CONSULTATION_BENEFITS = [
  {
    id: 1,
    text: 'Get expert guidance tailored to your specific construction needs'
  },
  {
    id: 2,
    text: 'Understand potential costs and timelines before committing'
  },
  {
    id: 3,
    text: 'Receive personalized recommendations based on your location and requirements'
  },
  {
    id: 4,
    text: 'Explore various design options with professional feedback'
  },
  {
    id: 5,
    text: 'Identify potential challenges before they become costly problems'
  }
];

const CONSULTATION_MESSAGES = {
  sidebar: {
    title: 'Why Request a Consultation?',
    description: 'Our expert consultation provides valuable insights to help you make informed decisions about your construction project.'
  },
  mainTitle: 'Schedule Your Consultation',
  mainDescription: 'Choose a convenient time for your consultation. Our experts are ready to help you with your construction project.',
  successAlert: {
    title: 'Appointment Scheduled Successfully!',
    message: 'You\'ll receive a confirmation email with meeting details shortly.'
  },
  loadingMessage: 'Loading scheduling calendar...',
  disabledMessage: 'Calendly scheduling is currently disabled.',
  infoAlert: 'After booking your appointment, you\'ll receive a confirmation email with meeting details and a calendar invite.'
};

export default function ConsultationForm() {
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [calendlyLoading, setCalendlyLoading] = useState(true);
  const [affiliateId, setAffiliateId] = useState('');
  const [finalCalendlyUrl, setFinalCalendlyUrl] = useState('');

  const searchParams = useSearchParams();
  const showCalendly = process.env.NEXT_PUBLIC_SHOW_CALENDLY === 'true';
  const baseCalendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_WIDGET_URL;

  // Initialize affiliate ID from URL or localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get affiliate ID from URL parameter or localStorage
    const urlAffiliateId = searchParams.get('sa');
    const savedAffiliateId = localStorage.getItem('affiliateId');
    
    let finalAffiliateId = '';

    if (urlAffiliateId) {
      // Priority: URL parameter > localStorage
      finalAffiliateId = urlAffiliateId;
      localStorage.setItem('affiliateId', urlAffiliateId);
    } else if (savedAffiliateId) {
      // Use saved affiliate ID from localStorage
      finalAffiliateId = savedAffiliateId;
    }

    setAffiliateId(finalAffiliateId);
  }, [searchParams]);

  // Build Calendly URL with affiliate ID
  useEffect(() => {
    if (!baseCalendlyUrl) return;

    let urlWithParams = baseCalendlyUrl;
    
    if (affiliateId) {
      const separator = baseCalendlyUrl.includes('?') ? '&' : '?';
      urlWithParams = `${baseCalendlyUrl}${separator}utm_source=${encodeURIComponent(affiliateId)}`;
    }

    setFinalCalendlyUrl(urlWithParams);
  }, [baseCalendlyUrl, affiliateId]);

  // Load Calendly script
  useEffect(() => {
    if (!showCalendly) return;

    if (!document.getElementById('calendly-script')) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;

      script.onload = () => setCalendlyLoading(false);
      script.onerror = () => setCalendlyLoading(false);

      document.body.appendChild(script);

      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, [showCalendly]);

  // Listen for Calendly events
  useEffect(() => {
    if (!showCalendly) return;

    const handleMessage = (event) => {
      if (event.data.event === 'calendly.event_scheduled') {
        setBookingCompleted(true);
        
        // Submit affiliate ID to backend
        if (affiliateId) {
          submitAffiliateIdToBackend(affiliateId);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showCalendly, affiliateId]);

  // Submit affiliate ID to backend
  const submitAffiliateIdToBackend = async (id) => {
    try {
      const response = await fetch('/api/consultation/submit-affiliate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affiliateId: id,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log('Affiliate ID submitted successfully');
        // Optionally clear localStorage after successful submission
        // localStorage.removeItem('affiliateId');
      } else {
        console.error('Failed to submit affiliate ID');
      }
    } catch (error) {
      console.error('Error submitting affiliate ID:', error);
    }
  };

  const BenefitsSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6 md:w-96 flex-shrink-0">
      <h3 className="font-bold text-xl text-gray-900 mb-4">{CONSULTATION_MESSAGES.sidebar.title}</h3>
      <p className="text-gray-500 mb-6">
        {CONSULTATION_MESSAGES.sidebar.description}
      </p>

      <ul className="space-y-4">
        {CONSULTATION_BENEFITS.map((benefit) => (
          <li key={benefit.id} className="flex items-start">
            <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
            <span className="text-gray-700">{benefit.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (!showCalendly) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-700 text-lg">{CONSULTATION_MESSAGES.disabledMessage}</p>
      </div>
    );
  }

  return (
    <div className=" bg-gray-100 flex flex-col items-center justify-start py-6 px-4">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row-reverse gap-8 w-full max-w-7xl">
        <BenefitsSidebar />

        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 relative">
          <div className="text-center mb-6">
            <h1 className="md:text-3xl text-xl font-bold text-amber-500 mb-2 flex items-center justify-center gap-2">
              <FaCalendarAlt />
              {CONSULTATION_MESSAGES.mainTitle}
            </h1>
            <p className="text-gray-600 md:text-base text-sm max-w-3xl mx-auto">
              {CONSULTATION_MESSAGES.mainDescription}
            </p>
          </div>

          {/* Affiliate ID Input */}
          {affiliateId && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate ID
              </label>
              <input
                type="text"
                value={affiliateId}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>
          )}

          {bookingCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
              <FaCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
              <div>
                <p className="text-green-800 font-semibold">{CONSULTATION_MESSAGES.successAlert.title}</p>
                <p className="text-green-700 text-sm">{CONSULTATION_MESSAGES.successAlert.message}</p>
              </div>
            </div>
          )}

          {calendlyLoading && (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                <p className="text-gray-600">{CONSULTATION_MESSAGES.loadingMessage}</p>
              </div>
            </div>
          )}

          <div
            className="calendly-inline-widget"
            data-url={finalCalendlyUrl || baseCalendlyUrl}
            style={{ minWidth: '220px', height: '500px', display: calendlyLoading ? 'none' : 'block' }}
          ></div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 flex items-start">
            <IoInformationCircle className="text-blue-500 mr-2 text-2xl mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              {CONSULTATION_MESSAGES.infoAlert}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
