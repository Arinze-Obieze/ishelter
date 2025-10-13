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
      if (!projects.length) {
        setProjectDocuments({});
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const documentsMap = {};
        
        for (const project of projects) {
          const projectRef = doc(db, "projects", project.id);
          const projectSnap = await getDoc(projectRef);
          
          if (projectSnap.exists()) {
            const projectData = projectSnap.data();
            documentsMap[project.id] = {
              documents: projectData.documents || [],
              pendingApproval: projectData.pendingApprovalDocs || [],
              totalCount: (projectData.documents || []).length,
              newCount: (projectData.documents || []).filter(doc => {
                // Consider documents from the last 7 days as new
                const uploadDate = doc.uploadDate?.toDate();
                if (!uploadDate) return false;
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return uploadDate > sevenDaysAgo;
              }).length
            };
          }
        }

        setProjectDocuments(documentsMap);
        setError(null);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to fetch project documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [projects]);

  return (
    <DocumentsContext.Provider value={{ projectDocuments, loading, error }}>
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
