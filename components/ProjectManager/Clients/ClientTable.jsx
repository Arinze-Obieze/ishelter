"use client"

import { Mail, Phone, ChevronDown, ChevronUp } from "lucide-react"

export default function ClientsTable({ clients, onSort, sortBy, sortDirection }) {
  const columns = [
    { key: "name", label: "CLIENT NAME" },
    { key: "contact", label: "PRIMARY CONTACT" },
    { key: "projects", label: "ASSOCIATED PROJECTS" },
    { key: "value", label: "TOTAL CLIENT VALUE" },
    { key: "status", label: "STATUS" },
    { key: "lastActivity", label: "LAST ACTIVITY" },
  ]

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return <ChevronDown className="ml-1 inline h-3 w-3 text-gray-400" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3 text-orange-500" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3 text-orange-500" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="cursor-pointer px-6 py-4 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50"
                onClick={() => onSort(column.key)}
              >
                <div className="flex items-center">
                  {column.label}
                  <SortIcon column={column.key} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold text-gray-900">{client.name}</td>
              <td className="px-6 py-4 text-gray-600">
                <div className="flex items-center gap-2">
                  {client.contact.type === "phone" ? (
                    <>
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{client.contact.value}</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{client.contact.value}</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {client.projects}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">{client.value}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    client.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : client.status === "On Hold"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {client.status === "On Hold" && "● "}
                  {client.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{client.lastActivity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}