'use client'
import { useState, Suspense } from 'react';
import SchedulingPage from '@/components/ConsultationSteps/Step2';
import Link from 'next/link';

function ConsultationContent({ bookingCompleted, setBookingCompleted }) {
  return (
    <SchedulingPage 
      bookingCompleted={bookingCompleted}
      setBookingCompleted={setBookingCompleted}
      onBack={() => {}}
    />
  );
}

export default function ConsultationForm() {
  const [bookingCompleted, setBookingCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start py-6">
      {/* Header */}
      <div className="flex md:flex-row max-md:space-y-4 flex-col max-w-7xl justify-between items-center w-full px-6 mb-8">
        <Link href={'/'}>
          <div className="bg-white px-4 py-2 rounded shadow flex items-center">
            <span className="text-amber-500 font-bold text-lg">i</span>
            <span className="text-black font-bold text-lg ml-1">SHELTER</span>
          </div>
        </Link>
      </div>

      {/* Scheduling Page */}
      <Suspense fallback={<div className="text-center py-12">Loading consultation form...</div>}>
        <ConsultationContent 
          bookingCompleted={bookingCompleted}
          setBookingCompleted={setBookingCompleted}
        />
      </Suspense>
    </div>
  );
}
