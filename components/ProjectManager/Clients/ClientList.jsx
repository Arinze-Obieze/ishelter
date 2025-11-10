import { Mail, Phone, ChevronRight } from "lucide-react"

export default function ClientsList({ clients }) {
  return (
    <div className="space-y-3">
      {clients.map((client) => (
        <div key={client.id} className="relative flex gap-3 rounded-lg bg-white p-4">
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-bold text-gray-900">{client.name}</h3>
              <span
                className={`text-xs font-semibold ${
                  client.status === "Active"
                    ? "text-green-600"
                    : client.status === "On Hold"
                      ? "text-amber-600"
                      : "text-gray-600"
                }`}
              >
                {client.status === "On Hold" && "● "}
                {client.status}
              </span>
            </div>

            <div className="mb-2 flex gap-2">
              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                {client.projects} Project{client.projects !== 1 ? "s" : ""}
              </span>
              <span className="font-bold text-gray-900">{client.value}</span>
            </div>

            <div className="mb-1 flex items-center gap-2 text-gray-600">
              {client.contact.type === "phone" ? (
                <>
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{client.contact.value}</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{client.contact.value}</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">Last activity {client.lastActivity}</p>
          </div>

          <div className="flex items-center justify-center">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          {/* Blue bar on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-lg bg-blue-500"></div>
        </div>
      ))}
    </div>
  )
}
