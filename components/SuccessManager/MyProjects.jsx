'use client';
import {  FiCalendar, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaFlag, FaCalendarAlt } from 'react-icons/fa';
import { FaClipboardList } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";
import { IoEye } from "react-icons/io5";

export default function MyProjects() {
  const projects = [
    {
      id: 1,
      name: "Lekki Peninsula Villa",
      client: "Mr. Adebayo",
      status: "In Progress",
      statusColor: "bg-orange-100 text-primary",
      progress: 65,
      milestone: "Foundation Completion - June 15, 2023",
      stats: { approvals: 2, messages: 3, overdue: 0 },
    },
    {
      id: 2,
      name: "Victoria Island Duplex",
      client: "Mrs. Okonkwo",
      status: "Delayed",
      statusColor: "bg-pink-100 text-pink-500",
      progress: 42,
      milestone: "First Floor Completion - June 30, 2023",
      stats: { approvals: 0, messages: 1, overdue: 2 },
    },
  ];

  return (
    <div className="p-6 md:max-w-7xl mt-8  mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
      <FaClipboardList className="text-primary text-base md:text-xl"/> My Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white  rounded-2xl shadow-md p-5 flex flex-col">
            {/* Project Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${project.statusColor}`}>
                {project.status}
              </span>
            </div>

            {/* Client Info */}
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
            <BsPersonFill className="text-xl"/> {project.client}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-1">Project Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-orange-600 font-medium mt-1">
                {project.progress}%
              </p>
            </div>

            {/* Next Milestone */}
            <div className="mb-4 max-md:hidden">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FaFlag className="text-primary" /> Next Milestone
              </p>
              <p className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <FaCalendarAlt /> {project.milestone}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4 max-md:hidden">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xl font-bold text-gray-800">{project.stats.approvals}</p>
                <p className="text-xs text-gray-500">Pending Approvals</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xl font-bold text-gray-800">{project.stats.messages}</p>
                <p className="text-xs text-gray-500">Unread Messages</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="text-xl font-bold text-gray-800">{project.stats.overdue}</p>
                <p className="text-xs text-gray-500">Overdue Tasks</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto">
              <button className="flex  items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100">
                <FaWhatsapp /> Chat
              </button>
              <button className="flex  max-md:hidden items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100">
                <FiSend /> Request Approval
              </button>
              <button className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600">
              <IoEye />  View Project
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
