'use client'
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

export default function SchedulingPage({ onBack, bookingCompleted, setBookingCompleted }) {
  const [calendlyLoading, setCalendlyLoading] = useState(true);

  // Calendly script loading
  useEffect(() => {
    if (!document.getElementById('calendly-script')) {
      const script = document.createElement('script');
      script.id = 'calendly-script';
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Calendly script loaded successfully');
        setCalendlyLoading(false);
      };
      
      script.onerror = () => {
        console.error('Failed to load Calendly script');
        setCalendlyLoading(false);
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  // Listen for Calendly events
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.event && event.data.event === 'calendly.event_scheduled') {
        setBookingCompleted(true);
        console.log('Appointment scheduled:', event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setBookingCompleted]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="mt-8 mb-8 text-center">
        <h1 className="md:text-3xl text-xl font-bold text-amber-500 mb-4 flex items-center justify-center gap-3">
          <FaCalendarAlt />
          Schedule Your Consultation
        </h1>
        <p className="text-gray-600 md:text-base text-sm max-w-3xl mx-auto">
          Choose a convenient time for your consultation. Our experts are ready to help you with your construction project.
        </p>
      </div>

      {bookingCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
          <FaCheckCircle className="text-green-500 mr-3 text-xl flex-shrink-0" />
          <div>
            <p className="text-green-800 font-semibold">Appointment Scheduled Successfully!</p>
            <p className="text-green-700 text-sm">You'll receive a confirmation email with meeting details shortly.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
        {calendlyLoading && (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading scheduling calendar...</p>
            </div>
          </div>
        )}
        
        <div 
          className="calendly-inline-widget" 
          data-url="https://calendly.com/everythingshelter-com-ng?hide_gdpr_banner=1&primary_color=f07d00"
          style={{ 
            minWidth: '220px', 
            height: '700px', 
            display: calendlyLoading ? 'none' : 'block' 
          }}
        ></div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 flex items-start">
        <IoInformationCircle className="text-blue-500 mr-2 text-2xl mt-0.5 flex-shrink-0"/>
        <p className="text-blue-800 text-sm">
          After booking your appointment, you'll receive a confirmation email with meeting details and a calendar invite.
        </p>
      </div>

      <div className="flex justify-start">
        <button 
          onClick={onBack}
          className="flex items-center bg-white border border-gray-300 rounded-lg px-5 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <FaArrowLeft className="mr-2"/> 
          Back to Information
        </button>
      </div>
    </div>
  );
}