"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TabsNavigation({ tabs, activeTab, onTabChange }) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <nav
            className="flex space-x-6 [&>*]:cursor-pointer sm:space-x-8 overflow-x-auto overflow-y-hidden scrollbar-hide"
         
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 transition-colors ${
                  activeTab === tab
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          
          {/* Gradient overlay for visual cue on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>
      
    
    </div>
  )
}