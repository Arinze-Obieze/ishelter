'use client';
import { useState } from 'react';
import { FiDollarSign,  FiEye, FiSend, FiCornerUpRight } from 'react-icons/fi';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaFolder } from "react-icons/fa";
export default function ActionRequired() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      colour:"orange",
      icon: <IoChatbubbleEllipsesSharp className="text-primary text-xl" />,
      title: "Client Needs Update",
      description: "Mr. Adebayo has requested an update on the foundation completion timeline.",
      location: "Lekki Peninsula Villa",
      time: "2 hours ago",
      actions: [
        { label: "View Message", icon: <FiEye />, style: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        { label: "Respond", icon: <FiCornerUpRight />, style: "bg-primary text-white hover:bg-orange-600" },
      ]
    },
    {
      id: 2,
      colour:"yelow",
      icon: <FiDollarSign className="text-yellow-500 text-xl" />,
      title: "Payment Overdue",
      description: "Phase 2 payment of ₦4,500,000 is overdue by 5 days.",
      location: "Victoria Island Duplex",
      time: "1 day ago",
      actions: [
        { label: "View Invoice", icon: <FiEye />, style: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        { label: "Send Reminder", icon: <FiSend />, style: "bg-primary text-white hover:bg-orange-600" },
      ]
    },
    {
      id: 3,
      colour:"blue",
      icon: <IoDocumentText className="text-blue-500 text-xl" />,
      title: "Document Approval Needed",
      description: "Revised floor plan needs client approval before construction can continue.",
      location: "Ikoyi Apartment Complex",
      time: "12 hours ago",
      actions: [
        { label: "View Document", icon: <FiEye />, style: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
        { label: "Request Approval", icon: <FiSend />, style: "bg-primary text-white hover:bg-orange-600" },
      ]
    },
  ]);

  return (
    <div className=" p-2 md:p-6 md:max-w-7xl mx-auto bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="md:text-xl text-base font-bold text-gray-800 flex items-center gap-2">
          ⚠️ Action Required
        </h2>
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <input type="checkbox" className="accent-primary" />
          <span className="max-md:hidden">Mark All as Read</span>
        </label>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row items-start justify-between p-4 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex md:gap-4 gap-2">
              <div className={`mt-1 bg-${item.colour}-100 w-fit rounded-full h-fit p-2`}>{item.icon}</div>
              <div>
                <h3 className="font-semibold text-base text-gray-800">{item.title}</h3>
                <p className="text-gray-600 text-sm max-md:mt-4">{item.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 md:mt-2">
                  <span className="flex space-x-2"><FaFolder /> <p>{item.location}</p></span>
                  <span>⏱ {item.time}</span>
                </div>
              </div>
            </div>

            <div className="flex  gap-2  ml-4 md:ml-4 max-md:mt-4">
              {item.actions.map((action, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-2 md:px-3 px-2 py-1 rounded-lg text-xs md:text-sm font-medium transition ${action.style}`}
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
