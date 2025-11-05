import { FaWhatsapp } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { usePersonalProjects } from "@/contexts/PersonalProjectsContext";

const WhatsAppGroupsCard = () => {
  const { projects, loading } = usePersonalProjects();
  
  // Get the first project's WhatsApp links (assuming single project for now)
  const whatsappLinks = projects[0]?.whatsappLinks || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <FiMessageCircle className="text-green-500 text-xl" />
        <div>
          <p className="text-lg font-bold">WhatsApp Groups</p>
        </div>
      </div>

      {whatsappLinks.length > 0 ? (
        <div className="space-y-2">
          {whatsappLinks.map((group, index) => (
            <div key={index} className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">{group.name}</p>
              <a
                href={group.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-50 text-green-600 font-medium rounded-lg py-2 border border-green-200 hover:bg-green-100 flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={20} /> Join {group.name}
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <FaWhatsapp className="text-gray-400 text-2xl" />
          </div>
          <p className="text-sm text-gray-500 max-w-[250px]">
            No WhatsApp groups have been created for this project yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppGroupsCard;