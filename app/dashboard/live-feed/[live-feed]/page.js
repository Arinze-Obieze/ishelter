import FeedTimeline from "@/components/Dashboard/LiveFeed/Id/FeedTimeline"
import FilterTabs from "@/components/Dashboard/LiveFeed/Id/FilterTabs"
import Header from "@/components/Dashboard/LiveFeed/Id/Headers"
import LiveFeedSection from "@/components/Dashboard/LiveFeed/Id/LiveFeedSection"
import { AiFillClockCircle } from "react-icons/ai"

const feedData = [
  {
    id: 1,
    date: "June 15, 2023",
    time: "2:45 PM",
    title: "Roofing materials delivered and staged for installation",
    image: "/construction-roofing-materials.jpg",
    type: "PHOTO",
    person: "Site Manager",
    personInitial: "JD",
    role: "Site Manager",
  },
  {
    id: 2,
    date: "June 15, 2023",
    time: "11:30 AM",
    title: "Plumbing inspection completed - passed all requirements",
    image: "/plumbing-inspection.png",
    type: "PHOTO",
    person: "Inspector",
    personInitial: "AS",
    role: "Inspector",
  },
  {
    id: 3,
    date: "June 14, 2023",
    time: "3:15 PM",
    title: "Foundation concrete pouring completed for east wing",
    image: "/foundation-concrete-pouring.jpg",
    type: "VIDEO",
    person: "Site Manager",
    personInitial: "MJ",
    role: "Site Manager",
  },
  {
    id: 4,
    date: "June 14, 2023",
    time: "10:00 AM",
    title: "Electrical wiring installation begun on first floor",
    image: "/electrical-wiring-installation.png",
    type: "PHOTO",
    person: "Electrician",
    personInitial: "JD",
    role: "Electrician",
  },
  {
    id: 5,
    date: "June 12, 2023",
    time: "4:30 PM",
    title: "Wall framing completed on main level ahead of schedule",
    image: "/wall-framing-construction.jpg",
    type: "PHOTO",
    person: "Lead Carpenter",
    personInitial: "AS",
    role: "Lead Carpenter",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Desktop: Live Feed Section */}
      <div className="hidden lg:block">
        <LiveFeedSection />
      </div>

      {/* Mobile + Desktop Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterTabs />

        {/* Mobile Timeline View */}
        <div className="lg:hidden mt-8">
          <FeedTimeline feedData={feedData} />
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:block mt-8">
          <div className="space-y-12">
            {["June 15, 2023", "June 14, 2023", "June 12, 2023"].map((dateGroup) => (
              <div key={dateGroup}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <h3 className="text-lg font-semibold text-foreground">{dateGroup}</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {feedData
                    .filter((item) => item.date === dateGroup)
                    .map((item) => (
                      <FeedCard key={item.id} item={item} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedCard({ item }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
        <div className="absolute top-3 right-3 bg-gray-800 text-white px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1">
          <span>■</span> {item.type}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <AiFillClockCircle className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-orange-600 font-medium">{item.time}</span>
        </div>
        <h3 className="font-semibold text-foreground mb-3 line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-orange-600">{item.personInitial}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.person}</span>
          </div>
          <a href="#" className="text-orange-600 text-sm font-medium hover:underline">
            {item.type === "VIDEO" ? "Play video" : "Details"}
          </a>
        </div>
      </div>
    </div>
  )
}
