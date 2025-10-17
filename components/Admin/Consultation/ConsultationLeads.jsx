import React from "react";

const leads = [
  // {
  //   id: "1",
  //   name: "Sarah Johnson",
  //   email: "sarah@example.com",
  //   isNew: true,
  // },
  // {
  //   id: "2",
  //   name: "Michael Brown",
  //   email: "michael@company.co",
  //   isNew: true,
  // },
  // {
  //   id: "3",
  //   name: "Emily Davis",
  //   email: "emily@startup.io",
  //   isNew: true,
  // },
];

export default function ConsultationLeads() {
  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="md:text-xl text-base font-semibold text-gray-900">Consultation Leads</h2>
        <button className="text-orange-500 hover:text-orange-600 font-medium text-sm">
          View All Leads
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.map((lead) => (
          <div key={lead.id} className="flex items-center justify-between py-2">
            {/* Lead Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">{lead.name}</p>
              <p className="text-sm text-gray-600">{lead.email}</p>
            </div>

            {/* New Badge */}
            {lead.isNew && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                New
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
