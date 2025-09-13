import {  FaFileInvoice, FaClipboardCheck, FaEnvelope, FaBoxOpen, FaPlus, FaFileAlt, FaCreditCard, FaHeadset, FaCalendarAlt } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import SuccessManagerCard from "./SuccessManagerCard";
import Notifications from "./Notifications";
import QuickActions from "./QuickActions";

export default function ManagerCard() {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6 ">
      {/* Success Manager Card */}
     <SuccessManagerCard />

      {/* Notifications */}
   <Notifications/>

      {/* Quick Actions */}
     <QuickActions/>

      {/* Account Manager */}
      {/* <div className="bg-white rounded-lg shadow-sm p-4">
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
      </div> */}
    </div>
  );
}
