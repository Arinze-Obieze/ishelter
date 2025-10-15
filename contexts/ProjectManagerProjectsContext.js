"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, where, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const ProjectManagerContext = createContext();

export const ProjectManagerProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isProjectManager, setIsProjectManager] = useState(false);

  // ✅ Watch authentication state and verify role
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserProfile(null);
        setIsProjectManager(false);
        setProjects([]);
        setLoading(false);
        return;
      }

      // console.log("Project Manager Context - UID:", firebaseUser.uid);

      // Check if user is a project manager and fetch full profile
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isPM = userData.role === "project manager";
          setIsProjectManager(isPM);
          
          if (isPM) {
            console.log("User is a project manager");
            setUser(firebaseUser);
            
            // Store full user profile
            setUserProfile({
              uid: firebaseUser.uid,
              email: userData.email || firebaseUser.email,
              displayName: userData.displayName || userData.name || 'Project Manager',
              photoURL: userData.photoURL || null,
              role: userData.role,
              status: userData.status || 'active',
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
              phone: userData.phone || null,
              bio: userData.bio || null,
            });
          } else {
            console.log("User is not a project manager, role:", userData.role);
            setUser(null);
            setUserProfile(null);
            setProjects([]);
            setLoading(false);
          }
        } else {
          console.log("User document not found");
          setUser(null);
          setUserProfile(null);
          setIsProjectManager(false);
          setProjects([]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        setUser(null);
        setUserProfile(null);
        setIsProjectManager(false);
        setProjects([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch projects managed by this project manager
  useEffect(() => {
    if (!user || !isProjectManager) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectsRef = collection(db, "projects");
    // Query projects where projectManager reference equals current user
    const managerRef = doc(db, "users", user.uid);
    const q = query(projectsRef, where("projectManager", "==", managerRef));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        // Process each project and resolve references
        const projectPromises = snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Resolve projectUsers references if they exist
          let projectUsersData = [];
          let clientName = 'Client not assigned';
          let clientEmail = '';
          
          // console.log("Project:", data.projectName);
          // console.log("projectUsers array:", data.projectUsers);
          
          if (data.projectUsers && Array.isArray(data.projectUsers)) {
            // console.log("projectUsers length:", data.projectUsers.length);
            
            const userPromises = data.projectUsers.map(async (userRef, index) => {
              try {
                // console.log(`Processing user ${index}:`, userRef);
                // console.log(`User ref path:`, userRef?.path);
                
                if (userRef && userRef.path) {
                  const userDoc = await getDoc(userRef);
                  // console.log(`User doc exists for ${index}:`, userDoc.exists());
                  
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    // console.log(`User data for ${index}:`, userData);
                    
                    return {
                      id: userDoc.id,
                      uid: userData.uid || userDoc.id,
                      displayName: userData.displayName || 'Unknown',
                      email: userData.email || '',
                      role: userData.role || '',
                      status: userData.status || '',
                      createdAt: userData.createdAt || '',
                      lastLogin: userData.lastLogin || null
                    };
                  } else {
                    console.log(`User document ${index} doesn't exist`);
                  }
                } else {
                  console.log(`Invalid userRef at ${index}`);
                }
              } catch (err) {
                console.error(`Error fetching project user ${index}:`, err);
              }
              return null;
            });
            
            const users = await Promise.all(userPromises);
            projectUsersData = users.filter(u => u !== null);
            
            // console.log("Resolved projectUsersData:", projectUsersData);
            
            // Set client name and email from first user in projectUsers array
            if (projectUsersData.length > 0) {
              clientName = projectUsersData[0].displayName;
              clientEmail = projectUsersData[0].email;
              // console.log("Set clientName:", clientName);
              // console.log("Set clientEmail:", clientEmail);
            } else {
              console.log("No users found in projectUsersData");
            }
          } else {
            console.log("projectUsers is not an array or doesn't exist");
          }

          // Resolve successManagers references if they exist
          let successManagersData = [];
          if (data.successManagers && Array.isArray(data.successManagers)) {
            const smPromises = data.successManagers.map(async (smRef) => {
              try {
                if (smRef && smRef.path) {
                  const smDoc = await getDoc(smRef);
                  if (smDoc.exists()) {
                    const smData = smDoc.data();
                    return {
                      id: smDoc.id,
                      uid: smData.uid || smDoc.id,
                      displayName: smData.displayName || smData.email || 'Unknown',
                      email: smData.email || '',
                      role: smData.role || ''
                    };
                  }
                }
              } catch (err) {
                console.error("Error fetching success manager:", err);
              }
              return null;
            });
            
            const sms = await Promise.all(smPromises);
            successManagersData = sms.filter(sm => sm !== null);
          }

          // Format dates
          const formatDate = (timestamp) => {
            if (!timestamp) return null;
            try {
              if (timestamp.toDate) {
                return timestamp.toDate().toISOString();
              }
              return timestamp;
            } catch {
              return timestamp;
            }
          };

          return {
            id: docSnapshot.id,
            projectName: data.projectName || 'Untitled Project',
            shortDescription: data.shortDescription || '',
            projectStatus: data.projectStatus || 'N/A',
            status: data.status || 'N/A',
            projectAddress: data.projectAddress || '',
            startDate: data.startDate || 'N/A',
            completionDate: data.completionDate || 'N/A',
            initialBudget: data.initialBudget || 'N/A',
            consultationPlan: data.consultationPlan || '',
            sendNotification: data.sendNotification || false,
            createdAt: formatDate(data.createdAt),
            updatedAt: formatDate(data.updatedAt),
            projectUsers: projectUsersData,
            successManagers: successManagersData,
            clientName: clientName,
            clientEmail: clientEmail,
          };
        });

        const managerProjects = await Promise.all(projectPromises);
        setProjects(managerProjects);
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
  }, [user, isProjectManager]);

  return (
    <ProjectManagerContext.Provider
      value={{ projects, loading, error, isProjectManager, userProfile }}
    >
      {children}
    </ProjectManagerContext.Provider>
  );
};

export const useProjectManager = () => {
  const context = useContext(ProjectManagerContext);
  if (!context) {
    throw new Error(
      "useProjectManager must be used within a ProjectManagerProvider"
    );
  }
  return context;
};