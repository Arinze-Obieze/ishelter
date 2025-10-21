"use client"

export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "timeline", label: "Task Timeline" },
    { id: "updates", label: "Live Feed & Updates" },
    { id: "bills", label: "Bills & Invoices" },
    { id: "documents", label: "Documents" },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Breadcrumb - Mobile */}
      <div className="md:hidden px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
        Dashboard &gt; Projects &gt; Residential Complex &gt; Phase 2
      </div>

      {/* Breadcrumb - Desktop */}
      <div className="hidden md:block px-6 py-2 text-xs text-gray-500 border-b border-gray-100">
        Dashboard &gt; Projects &gt; Residential Complex &gt; Phase 2
      </div>

      {/* Title and Tabs Container */}
      <div className="px-4 md:px-6 py-4">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Residential Complex - Phase 2</h1>

        {/* Tabs - Mobile */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors ${
                activeTab === tab.id ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs - Desktop */}
        <div className="hidden md:flex gap-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-500"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
