"use client"

import { AiFillClockCircle } from "react-icons/ai"

export default function FeedTimeline({ feedData }) {
  const groupedByDate = feedData.reduce((acc, item) => {
    if (!acc[item.date]) {
      acc[item.date] = []
    }
    acc[item.date].push(item)
    return acc
  }, {})

  const dateEntries = Object.entries(groupedByDate)

  return (
    <div className="relative">
      <div className="absolute left-2 top-0 bottom-0 w-1 bg-orange-500"></div>

      <div className="space-y-8 relative">
        {dateEntries.map(([date, items], dateIndex) => (
          <div key={date}>
            <div className="relative pl-8 mb-6">
              <div className="absolute left-0 top-0 -translate-x-1.5">
                <div className="w-5 h-5 bg-orange-500 rounded-full border-4 border-white shadow-md relative z-10"></div>
              </div>

              {/* Date label */}
              <p className="text-sm font-semibold text-foreground">{date}</p>
            </div>

            <div className="space-y-6 pl-8">
              {items.map((item, itemIndex) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-5 top-2 w-2.5 h-2.5 bg-orange-500 rounded-full relative z-10 border-2 border-white"></div>

                  {/* Content */}
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-gray-800 text-white px-2.5 py-1 rounded text-xs font-medium">
                        ■ {item.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AiFillClockCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-semibold text-orange-600">{item.time}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-4">{item.title}</h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-xs font-semibold text-orange-600">{item.personInitial}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{item.person}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded">
                            <span className="text-gray-400">💬</span>
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded">
                            <span className="text-gray-400">🔗</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
