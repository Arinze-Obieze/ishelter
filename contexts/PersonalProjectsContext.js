"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, where, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const PersonalProjectsContext = createContext();

export const PersonalProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // ✅ Watch authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProjects([]);
        setLoading(false);
        return;
      }

      console.log("UID:", firebaseUser.uid);
      console.log("Email:", firebaseUser.email);

      setUser(firebaseUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // ✅ Fetch projects
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectsRef = collection(db, "projects");
    const userRef = doc(db, "users", user.uid);
    const q = query(projectsRef, where("projectUsers", "array-contains", userRef));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        // Process each project and resolve references
        const projectPromises = snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Resolve projectManager reference if it exists
          let managerName = 'N/A';
          if (data.projectManager && typeof data.projectManager === 'object' && data.projectManager.path) {
            try {
              const managerDoc = await getDoc(data.projectManager);
              if (managerDoc.exists()) {
                const managerData = managerDoc.data();
                managerName = managerData.name || managerData.email || 'Unknown';
              }
            } catch (err) {
              console.error("Error fetching manager:", err);
            }
          } else if (typeof data.projectManager === 'string') {
            managerName = data.projectManager;
          }

          return {
            id: docSnapshot.id,
            projectName: data.projectName || 'Untitled Project',
            shortDescription: data.shortDescription || '',
            projectStatus: data.projectStatus || 'N/A',
            projectManager: managerName,
            startDate: data.startDate || 'N/A',
            initialBudget: data.initialBudget || 'N/A',
           status: data.status
          };
        });

        const userProjects = await Promise.all(projectPromises);
        setProjects(userProjects);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        if (err.code === "permission-denied") {
          setError(
            "You don't have permission to view projects. Please contact an administrator."
          );
          setProjects([]);
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <PersonalProjectsContext.Provider
      value={{ projects, loading, error }}
    >
      {children}
    </PersonalProjectsContext.Provider>
  );
};

export const usePersonalProjects = () => {
  const context = useContext(PersonalProjectsContext);
  if (!context) {
    throw new Error(
      "usePersonalProjects must be used within a PersonalProjectsProvider"
    );
  }
  return context;
};