"use client"

import React from "react";
import { FaFolder, FaSpinner, FaCheckCircle, FaPauseCircle } from "react-icons/fa";
import { useProjects } from "@/contexts/ProjectContext";

const useProjectsFallback = () => {
  return {
    projects: [],
    loading: false,
    error: null
  };
};

const ProjectStats = () => {
  let projectsContext;
  try {
    projectsContext = useProjects();
  } catch (error) {
    projectsContext = useProjectsFallback();
  }

  const { projects } = projectsContext;

  const totalProjects = projects.length;
  const inProgress = projects.filter(project => project.projectStatus === "inProgress").length;
  const completed = projects.filter(project => project.projectStatus === "completed").length;
  const onHold = projects.filter(project => project.projectStatus === "onHold").length;

  const stats = [
    {
      icon: <FaFolder className="text-primary text-2xl" />,
      title: "Total Projects",
      value: totalProjects,
    },
    {
      icon: <FaSpinner className="text-primary text-2xl" />,
      title: "In Progress",
      value: inProgress,
    },
    {
      icon: <FaCheckCircle className="text-primary text-2xl" />,
      title: "Completed",
      value: completed,
    },
    {
      icon: <FaPauseCircle className="text-primary text-2xl" />,
      title: "On Hold",
      value: onHold,
    },
  ];

  return (
    <div className="bg-gray-50 flex items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:max-w-8xl p-2 md:p-4 ">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm md:p-6 p-4 flex flex-col gap-2 border border-gray-100"
          >
            <div>{item.icon}</div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStats;
