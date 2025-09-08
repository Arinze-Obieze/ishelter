import {  FaFileInvoice, FaClipboardCheck, FaEnvelope, FaBoxOpen, FaPlus, FaFileAlt, FaCreditCard, FaHeadset, FaCalendarAlt } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import SuccessManagerCard from "./SuccessManagerCard";
import Notifications from "./Notifications";

export default function ManagerCard() {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6 ">
      {/* Success Manager Card */}
     <SuccessManagerCard />

      {/* Notifications */}
   <Notifications/>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4  space-y-3">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
        <button className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
          <FaPlus /> Start a New Project
        </button>
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
          <FaFileAlt /> View Documents
        </button>
        <button className="w-full bg-green-500 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
          <FaCreditCard /> Manage Payments
        </button>
        <button className="w-full bg-purple-600 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
          <FaHeadset /> Contact Support
        </button>
        <button className="w-full bg-gray-700 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2">
          <FaCalendarAlt /> Schedule a Meeting
        </button>
      </div>

      {/* Account Manager */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm text-gray-500 mb-2">Account Manager</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">LM</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">Lisa Martínez</p>
            <p className="text-xs text-gray-500">Available Mon-Fri, 9AM-5PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
