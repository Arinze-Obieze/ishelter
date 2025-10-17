const alerts = [
  {
    title: "Server Performance Boost",
    level: "Excellent",
    levelColor: "bg-green-600 text-white",
    borderColor: "border-green-600",
    cardColor: "bg-green-50",
    desc: "Server load is stable and running efficiently at optimal performance levels.",
    actions: [
      { text: "View Report", color: "bg-green-500 text-white hover:bg-green-600" },
      { text: "Celebrate", color: "bg-green-100 text-green-700 border border-green-400 hover:bg-green-200" }
    ]
  },
  {
    title: "Smooth Payment Processing",
    level: "Good",
    levelColor: "bg-blue-500 text-white",
    borderColor: "border-blue-500",
    cardColor: "bg-blue-50",
    desc: "All payment transactions have been processed successfully in the last hour.",
    actions: [
      { text: "View Details", color: "bg-blue-500 text-white hover:bg-blue-600" },
      { text: "Acknowledge", color: "bg-blue-100 text-blue-700 border border-blue-400 hover:bg-blue-200" }
    ]
  },
  // {
  //   title: "New Client Engagement",
  //   level: "Positive",
  //   levelColor: "bg-purple-500 text-white",
  //   borderColor: "border-purple-500",
  //   cardColor: "bg-purple-50",
  //   desc: 'Client "Acme Corp" has reached out with a new collaboration opportunity.',
  //   actions: [
  //     { text: "View Message", color: "bg-purple-500 text-white hover:bg-purple-600" },
  //     { text: "Respond", color: "bg-purple-100 text-purple-700 border border-purple-400 hover:bg-purple-200" }
  //   ]
  // }
];

const AlertCard = ({ title, level, levelColor, borderColor, cardColor, desc, actions }) => (
  <div className={`flex flex-col rounded-lg shadow p-4 md:p-6 min-w-[280px] ${cardColor} border-l-8 ${borderColor}`}>
    <div className="flex items-center justify-between mb-2">
      <span className="font-semibold text-lg">{title}</span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColor}`}>{level}</span>
    </div>
    <p className="text-gray-700 text-sm mb-4">{desc}</p>
    <div className="flex gap-3">
      {actions.map((a, idx) => (
        <button key={idx} className={`rounded px-4 py-2 text-sm font-semibold transition ${a.color}`}>{a.text}</button>
      ))}
    </div>
  </div>
);

const SystemAlerts = () => (
  <section className="bg-white rounded-xl p-6">
    <h2 className="font-semibold text-xl mb-4">System Highlights</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {alerts.map((al, i) => (
        <AlertCard key={i} {...al} />
      ))}
    </div>
  </section>
);

export default SystemAlerts;
