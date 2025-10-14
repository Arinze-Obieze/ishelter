"use client"

export default function TabsNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="relative">
          <nav className="[&>*]:cursor-pointer flex space-x-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-6 py-3 rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
          
          {/* Gradient overlay for visual cue on mobile */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 via-gray-50/50 to-transparent pointer-events-none sm:hidden" />
        </div>
      </div>
    </div>
  );
}