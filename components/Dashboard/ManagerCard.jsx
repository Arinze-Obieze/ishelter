import {  FaFileInvoice, FaClipboardCheck, FaEnvelope, FaBoxOpen, FaPlus, FaFileAlt, FaCreditCard, FaHeadset, FaCalendarAlt } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import SuccessManagerCard from "./SuccessManagerCard";

export default function ManagerCard() {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6 ">
      {/* Success Manager Card */}
     <SuccessManagerCard />

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <IoNotificationsOutline className="text-orange-500" /> Notifications
          </h3>
          <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
            4
          </span>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <FaFileInvoice className="text-orange-500" /> New invoice available
            </p>
            <p className="text-gray-500">Invoice #2034 for Lekki Duplex is ready for review</p>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2 hours ago</span>
              <span className="text-orange-500">Duplex at Lekki</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <FaClipboardCheck className="text-orange-500" /> Approval needed
            </p>
            <p className="text-gray-500">Design plan for Ikeja property requires your approval</p>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Yesterday</span>
              <span className="text-orange-500">Ikeja Commercial Property</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <FaEnvelope className="text-orange-500" /> Message from Project Manager
            </p>
            <p className="text-gray-500">Lisa: Updates on Highland Park project timeline</p>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2 days ago</span>
              <span className="text-orange-500">Modern Residence - Highland Park</span>
            </div>
          </div>

          <div>
            <p className="font-medium text-gray-800 flex items-center gap-2">
              <FaBoxOpen className="text-orange-500" /> Material selection required
            </p>
            <p className="text-gray-500">
              Please select flooring options for Abuja Office Complex
            </p>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3 days ago</span>
              <span className="text-orange-500">Abuja Office Complex</span>
            </div>
          </div>
        </div>

        <button className="w-full text-orange-600 text-sm font-medium mt-3 hover:underline">
          View All Notifications
        </button>
      </div>

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
