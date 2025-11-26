'use client'
import { useState } from 'react';
import SchedulingPage from '@/components/ConsultationSteps/Step2';
import Link from 'next/link';

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
      <SchedulingPage 
        bookingCompleted={bookingCompleted}
        setBookingCompleted={setBookingCompleted}
        onBack={() => {}}
      />
    </div>
  );
}
