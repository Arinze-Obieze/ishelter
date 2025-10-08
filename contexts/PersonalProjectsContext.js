"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PersonalProjectsContext = createContext();

export const PersonalProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // Listen for auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userId || !userEmail) {
      setProjects([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const projectsRef = collection(db, "projects");
    
    const unsubscribe = onSnapshot(
      projectsRef,
      (snapshot) => {
        const userProjects = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((project) => {
            // Check if user is project manager
            const isManager = project.projectManagerId === userId;
            
            // Check if user is success manager
            const isSuccessManager = Array.isArray(project.successManagerIds) && 
              project.successManagerIds.includes(userId);
            
            // Check if user is in projectUsers array by email
            const isProjectUser = Array.isArray(project.projectUsers) && 
              project.projectUsers.some(user => user.email === userEmail);
            
            return isManager || isSuccessManager || isProjectUser;
          });
        
        setProjects(userProjects);
        setLoading(false);
        setError(null);
      },
      (err) => {
        if (err.code === 'permission-denied') {
          setError("You don't have permission to view projects. Please contact an administrator.");
          setProjects([]);
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [userId, userEmail]);

  return (
    <PersonalProjectsContext.Provider value={{ projects, loading, error }}>
      {children}
    </PersonalProjectsContext.Provider>
  );
};

export const usePersonalProjects = () => {
  const context = useContext(PersonalProjectsContext);
  if (context === undefined) {
    throw new Error("usePersonalProjects must be used within a PersonalProjectsProvider");
  }
  return context;
};
