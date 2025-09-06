import { FaUserTie, FaPlane, FaBuilding, FaHome, FaChartLine } from "react-icons/fa";

const clients = [
  {
    id: 1,
    title: "Local Clients",
    description:
      "Professionals seeking expert construction management without the time commitment.",
    icon: FaUserTie,
  },
  {
    id: 2,
    title: "Diaspora Clients",
    description:
      "Nigerians abroad looking to invest in property back home with peace of mind.",
    icon: FaPlane,
  },
  {
    id: 3,
    title: "Real Estate Developers",
    description:
      "Developers seeking reliable project management for multiple properties.",
    icon: FaBuilding,
  },
  {
    id: 4,
    title: "First-Time Owners",
    description:
      "First-time homebuilders needing guidance through the construction process.",
    icon: FaHome,
  },
  {
    id: 5,
    title: "Investors",
    description:
      "Property investors looking to maximize returns through efficient project management.",
    icon: FaChartLine,
  },
];

export default function WhoWeServe() {
  return (
    <section className="bg-gray-100 md:py-16 py-8 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
          Who We Serve
        </h2>
        <p className="text-gray-600 text-lg">
          Our services are tailored to meet the specific needs of various client groups.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {clients.map(({ id, title, description, icon: Icon }) => (
          <div
            key={id}
            className="bg-white md:h-[440px]  shadow-sm rounded-xl p-6 text-center flex flex-col"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4 mt-4 md:mt-8">
              <div className="bg-orange-50 flex items-center justify-center md:w-20 md:h-20 w-16 h-16 rounded-full">
                <Icon className="text-primary text-3xl" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 mt-4 md:mt-8">
              <h3 className="font-bold text-lg text-text">{title}</h3>
              <p className="text-gray-600 text-sm max-sm:max-w-[200px] max-sm:mx-auto">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
