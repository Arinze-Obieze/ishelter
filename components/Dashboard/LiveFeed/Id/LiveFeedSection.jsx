import { FiPlay } from "react-icons/fi"

export default function LiveFeedSection() {
  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Watch Live Feed</h2>
          <p className="text-gray-600">Click to play</p>
        </div>

        <div className="relative rounded-lg overflow-hidden h-96 bg-gray-300 group cursor-pointer">
          <img src="/construction-site-building-framing.jpg" alt="Live feed" className="w-full h-full object-cover" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-20 h-20 rounded-full bg-orange-500/80 flex items-center justify-center">
              <FiPlay className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
