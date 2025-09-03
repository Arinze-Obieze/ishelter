import { GoArrowRight } from "react-icons/go";

export default function CoreServices() {
    const services = [
      {
        id: 1,
        title: "Land Acquisition",
        description:
            "We help you identify, verify, and acquire suitable land for your construction project, ensuring all legal requirements are met.",
            imageUrl: "/icons/service-icon1.png",
        learnMoreUrl: "#",
      },
      {
        id: 2,
        title: "Design Approval",
        description:
          "Our team guides you through the design process, working with architects and obtaining all necessary approvals and permits.",
        imageUrl: "/icons/service-icon2.png",
        learnMoreUrl: "#",
      },
      {
        id: 3,
        title: "Construction Management",
        description:
          "We oversee the entire construction process, from contractor selection to quality control and regular progress reporting.",
        imageUrl: "/icons/service-icon3.png",
        learnMoreUrl: "#",
      },
    ]
  
    return (
      <section className="bg-background py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="md:text-4xl font-bold text-gray-900 mb-4">Our Core Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg text-balance">
              We provide end-to-end solutions for your construction project needs, from land acquisition to final
              completion.
            </p>
          </div>
  
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white w-[346px] rounded-lg shadow-md overflow-hidden">
                {/* Image Header */}
                <div className="h-32 bg-orange-100">
                  <img
                    src={service.imageUrl || "/placeholder.svg"}
                    alt={`${service.title} icon`}
                    className="w-full h-full object-cover"
                  />
                </div>
  
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">{service.description}</p>
                  <a
                    href={service.learnMoreUrl}
                    className="inline-flex items-center text-orange-500 font-medium md:text-lg text-sm hover:text-orange-600 transition-colors"
                  >
                    Learn More
                    <GoArrowRight className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  