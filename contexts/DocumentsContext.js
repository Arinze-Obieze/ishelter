"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { usePersonalProjects } from "./PersonalProjectsContext";

const DocumentsContext = createContext();

export function DocumentsProvider({ children }) {
  const [projectDocuments, setProjectDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { projects } = usePersonalProjects();

  useEffect(() => {
    const fetchDocuments = async () => {
      // Only fetch documents for projects the user has access to
      if (!projects.length) {
        setProjectDocuments({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const documentsMap = {};
        
        // Fetch documents for each project the user has access to
        for (const project of projects) {
          const projectRef = doc(db, "projects", project.id);
          const projectSnap = await getDoc(projectRef);
          
          if (projectSnap.exists()) {
            const projectData = projectSnap.data();
            const documents = projectData.documents || [];
            
            // Calculate statistics
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const newCount = documents.filter(doc => {
              const uploadDate = doc.uploadDate?.toDate?.();
              if (!uploadDate) return false;
              return uploadDate > sevenDaysAgo;
            }).length;
            
            documentsMap[project.id] = {
              documents: documents,
              pendingApproval: projectData.pendingApprovalDocs || [],
              totalCount: documents.length,
              newCount: newCount
            };
          } else {
            // Project exists in user's list but no data found
            documentsMap[project.id] = {
              documents: [],
              pendingApproval: [],
              totalCount: 0,
              newCount: 0
            };
          }
        }

        setProjectDocuments(documentsMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch project documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [projects]);

  const value = {
    projectDocuments,
    loading,
    error,
    // Helper function to get all documents across all projects
    getAllDocuments: () => {
      const allDocs = [];
      Object.entries(projectDocuments).forEach(([projectId, data]) => {
        data.documents.forEach(doc => {
          allDocs.push({
            ...doc,
            projectId
          });
        });
      });
      return allDocs;
    },
    // Helper function to get documents for a specific project
    getProjectDocuments: (projectId) => {
      return projectDocuments[projectId]?.documents || [];
    }
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}