import { FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const testimonials = [
    {
      text: "iSHELTER made building my dream home from abroad completely stress-free. The regular updates and transparent reporting gave me peace of mind throughout the entire process.",
      name: "Chidi Okonkwo",
      location: "London, UK",
      image: "/testimonial/1.png",
    },
    {
      text: "As a busy professional in Lagos, I didn't have time to monitor my construction project. iSHELTER managed everything perfectly, and I'm extremely happy with the results.",
      name: "Amina Ibrahim",
      location: "Lagos, Nigeria",
      image: "/testimonial/2.png",
    },
    {
      text: "The team at iSHELTER helped me navigate the complex process of land acquisition and building approvals. Their expertise saved me time, money, and countless headaches.",
      name: "David Adeyemi",
      location: "Toronto, Canada",
      image: "/testimonial/3.png",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Our Clients Say
        </h2>
        <p className="text-text text-lg max-w-xl mx-auto mb-12">
          Don't just take our word for it. Here's what some of our satisfied clients have to say.
        </p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-gray-50 rounded-xl p-6 text-left shadow-sm hover:shadow-md transition"
            >
              {/* Quote Icon */}
              {/* <FaQuoteLeft className="absolute top-4 right-4 text-gray-200 text-3xl" /> */}

              {/* Testimonial Text */}
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                {item.text}
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
