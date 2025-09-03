import { FaUserTie, FaPlane, FaBuilding, FaHome, FaChartLine } from "react-icons/fa";

export default function WhoWeServe() {
  return (
    <section className="bg-gray-100 py-16 px-6 md:px-12 lg:px-20">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Who We Serve
        </h2>
        <p className="text-gray-600 text-lg">
          Our services are tailored to meet the specific needs of various client groups.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        
        {/* Local Clients */}
        <div className="bg-white shadow-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaUserTie className="text-orange-500 text-2xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Local Clients</h3>
          <p className="text-gray-600 text-sm">
            Professionals seeking expert construction management without the time commitment.
          </p>
        </div>

        {/* Diaspora Clients */}
        <div className="bg-white shadow-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaPlane className="text-orange-500 text-2xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Diaspora Clients</h3>
          <p className="text-gray-600 text-sm">
            Nigerians abroad looking to invest in property back home with peace of mind.
          </p>
        </div>

        {/* Real Estate Developers */}
        <div className="bg-white shadow-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaBuilding className="text-orange-500 text-2xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Real Estate Developers</h3>
          <p className="text-gray-600 text-sm">
            Developers seeking reliable project management for multiple properties.
          </p>
        </div>

        {/* First-Time Owners */}
        <div className="bg-white shadow-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaHome className="text-orange-500 text-2xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">First-Time Owners</h3>
          <p className="text-gray-600 text-sm">
            First-time homebuilders needing guidance through the construction process.
          </p>
        </div>
{/*  */}
        {/* Investors */}
        <div className="bg-white shadow-sm rounded-xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <FaChartLine className="text-orange-500 text-2xl" />
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">Investors</h3>
          <p className="text-gray-600 text-sm">
            Property investors looking to maximize returns through efficient project management.
          </p>
        </div>
      </div>
    </section>
  );
}
