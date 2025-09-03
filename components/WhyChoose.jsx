import { FaUserTie, FaGlobeAmericas, FaUsers } from "react-icons/fa";
import { MdMonitor } from "react-icons/md";

export default function Why() {
  return (
    <section className="bg-white pb-16 px-6 ">
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Why Choose iSHELTER?
        </h2>
        <p className="text-gray-600 text-lg">
          Our unique approach to construction management sets us apart and ensures your project&apos;s success.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Expert Guidance */}
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-4 rounded-lg">
            <FaUserTie className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Expert Guidance
            </h3>
            <p className="text-gray-600">
              Our team of experienced professionals provides expert advice and guidance throughout your project journey.
            </p>
          </div>
        </div>

        {/* Fully Digital Platform */}
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-4 rounded-lg">
            <MdMonitor className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Fully Digital Platform
            </h3>
            <p className="text-gray-600">
              Our innovative digital platform allows you to track progress, view reports, and communicate with your project team.
            </p>
          </div>
        </div>

        {/* Accessible Anytime, Anywhere */}
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-4 rounded-lg">
            <FaGlobeAmericas className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Accessible Anytime, Anywhere
            </h3>
            <p className="text-gray-600">
              Access your project details from anywhere in the world, at any time, using our mobile-friendly platform.
            </p>
          </div>
        </div>

        {/* Targeted for Local & Diaspora Clients */}
        <div className="flex items-start gap-4">
          <div className="bg-orange-100 p-4 rounded-lg">
            <FaUsers className="text-orange-500 text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Targeted for Local & Diaspora Clients
            </h3>
            <p className="text-gray-600">
              Our services are specifically designed to meet the needs of both local clients and Nigerians in the diaspora.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
