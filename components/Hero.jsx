import { Play, Shield } from "lucide-react"
import Image from "next/image"

const Hero = ()=>{
    return(
        <>
         <main className="px-4 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            {/* Content Column */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Manage Your Construction Project, <span className="text-primary">Anywhere in the World</span>
              </h1>

              <p className="text-lg text-text md:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Accessible, reliable, and expert online construction management services for Nigerians at home and
                abroad.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium text-lg">
                  Request a Free Consultation
                </button>
                <button
                  className="justify-center border-2 border-primary text-primary hover:bg-orange-50 px-8 py-3 rounded-lg font-medium text-lg flex items-center gap-2 bg-transparent"
                >
                  <Play className="h-5 w-5" />
                  Play Demo
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="mt-12 lg:mt-0 relative">
              <div className="relative rounded-2xl overflow-hidden ">
                <Image
                  src="/hero.png"
                  alt="Construction worker using laptop at construction site"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />

                {/* Security Badge Overlay */}
                {/* <div className="absolute bottom-6 left-6 bg-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">100% Secure Process</div>
                    <div className="text-xs text-gray-600">SSL secured transaction system</div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
        </>
    )
}
export default Hero