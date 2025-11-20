"use client"

export default function TabsNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      {/* Mobile: horizontal scroll only, Desktop: normal padding */}
      <div className="sm:px-6 lg:px-8 sm:py-4">
        <div className="relative overflow-hidden">
          {/* Mobile scrollable container - constrained width with overflow-x-auto */}
          <div className="overflow-x-auto overflow-y-hidden w-screen sm:w-full -mx-4 sm:mx-0 px-4 sm:px-0 py-4 sm:py-0 scrollbar-hide">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all ${
                      isActive
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
