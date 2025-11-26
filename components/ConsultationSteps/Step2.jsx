'use client'
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { IoInformationCircle } from 'react-icons/io5';

export default function ConsultationForm() {
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [calendlyLoading, setCalendlyLoading] = useState(true);

  const showCalendly = process.env.NEXT_PUBLIC_SHOW_CALENDLY === 'true';
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_WIDGET_URL;

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
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [showCalendly]);

  const BenefitsSidebar = () => (
    <div className="bg-white rounded-xl shadow-md p-6 md:w-96 flex-shrink-0">
      <h3 className="font-bold text-xl text-gray-900 mb-4">Why Request a Consultation?</h3>
      <p className="text-gray-500 mb-6">
        Our expert consultation provides valuable insights to help you make informed decisions about your construction project.
      </p>

      <ul className="space-y-4">
        <li className="flex items-start">
          <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
          <span className="text-gray-700">Get expert guidance tailored to your specific construction needs</span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
          <span className="text-gray-700">Understand potential costs and timelines before committing</span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
          <span className="text-gray-700">Receive personalized recommendations based on your location and requirements</span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
          <span className="text-gray-700">Explore various design options with professional feedback</span>
        </li>
        <li className="flex items-start">
          <FaCheckCircle className="text-amber-500 mt-1 mr-3 flex-shrink-0" size={18} />
          <span className="text-gray-700">Identify potential challenges before they become costly problems</span>
        </li>
      </ul>
    </div>
  );

  if (!showCalendly) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <p className="text-gray-700 text-lg">Calendly scheduling is currently disabled.</p>
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
            data-url={calendlyUrl}
            style={{ minWidth: '220px', height: '500px', display: calendlyLoading ? 'none' : 'block' }}
          ></div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 flex items-start">
            <IoInformationCircle className="text-blue-500 mr-2 text-2xl mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              After booking your appointment, you'll receive a confirmation email with meeting details and a calendar invite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
