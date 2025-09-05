import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

export default function Solution() {
  // Data for the challenge section
  const challengeData = {
    badge: {
      text: "The Challenge",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    },
    title: "Challenges",
    subtitle: "Construction Management",
    description: "Managing a construction project can be overwhelming, especially if you're not physically present at the site. Many investors face significant challenges:",
    items: [
      "Lack of transparency and difficulty monitoring progress from abroad",
      "Limited access to trustworthy professionals and service providers",
      "Complex regulatory processes and documentation requirements",
      "Risk of project delays, cost overruns, and quality issues"
    ]
  };
  // Data for the solution section
  const solutionData = {
    badge: {
      text: "The Solution",
      bgColor: "bg-teal-100",
      textColor: "text-teal-600"
    },
    title: (
      <>
      iSHELTER's Digital Approach
      </>
    ),
    description: "iSHELTER provides a comprehensive digital solution that eliminates the stress of managing construction projects remotely:",
    items: [
      "Real-time project monitoring and reporting through our digital platform",
      "Vetted network of professionals and contractors with proven track records",
      "Expert guidance through regulatory processes and paperwork",
      "Quality assurance checks and milestone-based progress tracking"
    ]
  };

  return (
    <div className="md:max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:pb-[80px]">
        {/* The Challenge Section */}
        <SectionCard 
          data={challengeData} 
          accentColor="orange" 
          icon="warning"
        />
        
        {/* The Solution Section */}
        <SectionCard 
          data={solutionData} 
          accentColor="teal" 
          icon="check"
        />
      </div>
    </div>
  );
}

// Reusable section card component
function SectionCard({ data, accentColor, icon }) {
  return (
    <div className="bg-white p- ">
      <div className="mb-6">
        <span className={`inline-block ${data.badge.bgColor} ${data.badge.textColor} text-sm font-medium px-3 py-1 rounded-full`}>
          {data.badge.text}
        </span>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h2>
      {data.subtitle && <h3 className="text-3xl font-bold text-gray-900 ">{data.subtitle}</h3>}
      <div className={`w-12 h-1 ${accentColor === 'orange' ? 'bg-orange-400' : 'bg-teal-400'} mb-6`}></div>

      <p className="text-gray-600 mb-8 leading-relaxed">{data.description}</p>

      <div className="space-y-4">
        {data.items.map((item, index) => (
          <ListItem 
            key={index} 
            text={item} 
            accentColor={accentColor} 
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
}

// List item component with appropriate icon
function ListItem({ text, accentColor, icon }) {
  return (
    <div className="flex items-start gap-3 place-items-center">
      <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full ${accentColor === 'orange' ? 'bg-orange-100' : 'bg-teal-100'}`}>
        {icon === "warning" ? (
          <FaExclamationTriangle className={`w-3 h-3 ${accentColor === 'orange' ? 'text-orange-600' : 'text-teal-600'}`} />
        ) : (
          <FaCheck className={`w-3 h-3 ${accentColor === 'orange' ? 'text-orange-600' : 'text-teal-600'}`} />
        )}
      </div>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}