const alerts = [
    {
      title: "High Server Load",
      level: "High",
      levelColor: "bg-pink-600 text-white",
      borderColor: "border-pink-600",
      cardColor: "bg-pink-50",
      desc: "Server load has been exceeding 85% for the past 30 minutes.",
      actions: [
        { text: "View Details", color: "bg-orange-500 text-white hover:bg-orange-600" },
        { text: "Resolve", color: "bg-orange-100 text-orange-600 border border-orange-400 hover:bg-orange-200" }
      ]
    },
    {
      title: "Payment Gateway Issue",
      level: "Medium",
      levelColor: "bg-yellow-400 text-white",
      borderColor: "border-yellow-400",
      cardColor: "bg-yellow-50",
      desc: "3 payment failures reported in the last hour.",
      actions: [
        { text: "View Details", color: "bg-orange-500 text-white hover:bg-orange-600" },
        { text: "Resolve", color: "bg-yellow-100 text-yellow-600 border border-yellow-400 hover:bg-yellow-200" }
      ]
    },
    {
      title: "New Support Request",
      level: "Low",
      levelColor: "bg-blue-500 text-white",
      borderColor: "border-blue-500",
      cardColor: "bg-blue-50",
      desc: 'Client "Acme Corp" has submitted a new support ticket.',
      actions: [
        { text: "View Request", color: "bg-orange-500 text-white hover:bg-orange-600" },
        { text: "Assign", color: "bg-blue-100 text-blue-700 border border-blue-400 hover:bg-blue-200" }
      ]
    }
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
      <h2 className="font-semibold text-xl mb-4">System Alerts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((al, i) => (
          <AlertCard key={i} {...al} />
        ))}
      </div>
    </section>
  );
  
  export default SystemAlerts;
  