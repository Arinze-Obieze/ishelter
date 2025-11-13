'use client';
import { FiCalendar, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaFlag, FaCalendarAlt } from 'react-icons/fa';
import { FaClipboardList } from "react-icons/fa6";
import { BsPersonFill } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { useProjectManager } from '@/contexts/ProjectManagerProjectsContext';
import { useRouter } from 'next/navigation';

export default function MyProjects() {
  const { projects, loading, error, isProjectManager } = useProjectManager();
  const router = useRouter();

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('progress') || statusLower.includes('active')) {
      return "bg-orange-100 text-primary";
    } else if (statusLower.includes('completed') || statusLower.includes('done')) {
      return "bg-green-100 text-green-600";
    } else if (statusLower.includes('delayed') || statusLower.includes('overdue')) {
      return "bg-pink-100 text-pink-500";
    } else if (statusLower.includes('pending') || statusLower.includes('awaiting')) {
      return "bg-yellow-100 text-yellow-600";
    } else {
      return "bg-gray-100 text-gray-600";
    }
  };

  // Helper function to calculate progress based on completed stages
  const calculateStageProgress = (taskTimeline) => {
    if (!taskTimeline || !Array.isArray(taskTimeline)) return 0;
    const totalStages = taskTimeline.length;
    const completedStages = taskTimeline.filter(stage => 
      stage.status === "Completed"
    ).length;
    return totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;
  };

  // Helper function to get next milestone (next stage not completed)
  const getNextMilestone = (taskTimeline) => {
    if (!taskTimeline || !Array.isArray(taskTimeline)) return 'No milestone set';
    const nextStage = taskTimeline.find(stage => stage.status !== "Completed");
    return nextStage ? nextStage.name || 'Unnamed Stage' : 'All stages completed';
  };

  if (loading) {
    return (
      <div className="p-6 md:max-w-7xl mt-8 mx-auto bg-white rounded-2xl shadow-md">
        <p className="text-center text-gray-600 py-10">Loading your projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:max-w-7xl mt-8 mx-auto bg-white rounded-2xl shadow-md">
        <p className="text-center text-red-600 py-10">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 md:max-w-7xl mt-8 mx-auto bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <FaClipboardList className="text-primary text-base md:text-xl"/> My Projects
        </h2>
        <p className="text-center text-gray-600 py-10">No projects assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:max-w-7xl mt-8  mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
      <FaClipboardList className="text-primary text-base md:text-xl"/> My Projects
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const progress = calculateStageProgress(project.taskTimeline);
          const statusColor = getStatusColor(project.projectStatus);
          const clientName = project.clientName || 'Client not assigned';
          const nextMilestone = getNextMilestone(project.taskTimeline);

          return (
            <div key={project.id} className="bg-white  rounded-2xl shadow-md p-5 flex flex-col">
              {/* Project Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{project.projectName}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}>
                  {project.projectStatus}
                </span>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
              <BsPersonFill className="text-xl"/> {clientName}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">Project Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-orange-600 font-medium mt-1">
                  {progress}%
                </p>
              </div>

              {/* Next Milestone */}
              <div className="mb-4 max-md:hidden">
                <p className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FaFlag className="text-primary" /> Next Milestone
                </p>
                <p className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <FaCalendarAlt /> {nextMilestone}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center mb-4 max-md:hidden">
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{project.pendingApprovals || 0}</p>
                  <p className="text-xs text-gray-500">Pending Approvals</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{project.unreadMessages || 0}</p>
                  <p className="text-xs text-gray-500">Unread Messages</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xl font-bold text-gray-800">{project.overdueTasks || 0}</p>
                  <p className="text-xs text-gray-500">Overdue Tasks</p>
                </div>
              </div>

              {/* Actions */}
              <div className="[&>*]:cursor-pointer flex items-center justify-between mt-auto">
                <button className="flex  items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100">
                  <FaWhatsapp /> Chat
                </button>
                {/* <button className="flex  max-md:hidden items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100">
                  <FiSend /> Request Approval
                </button> */}
                <button className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm hover:bg-orange-600"
                  onClick={() => router.push(`/project-manager/project-details/${project.id}`)}
                >
                  <IoEye />  View Project
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}