import Link from "next/link";

export default function CTASection() {
    return (
      <section className="relative bg-primary py-20 pt-24 text-center text-white overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full opacity-30 blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3"></div>
  
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-[40px] font-bold mb-6 leading-snug">
            Ready to Start Your Construction Journey?
          </h2>
          <p className="text-lg text-white/90 mb-10">
            Let us help you turn your construction dreams into reality, with expert
            guidance every step of the way.
          </p>
          <Link
            href="/consultation"
            className="inline-block text-lg bg-white text-primary font-semibold px-8 py-4 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Request Consultation
          </Link>
        </div>
      </section>
    );
  }
  