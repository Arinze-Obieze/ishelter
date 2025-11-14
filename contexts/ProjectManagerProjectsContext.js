"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, where, doc, getDoc, getDocs } from "firebase/firestore";
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

  // Watch authentication state and verify role
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

      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isPM = userData.role === "project manager";
          setIsProjectManager(isPM);
          
          if (isPM) {
            setUser(firebaseUser);
            
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
            setUser(null);
            setUserProfile(null);
            setProjects([]);
            setLoading(false);
          }
        } else {
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

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (completionDate) => {
    if (!completionDate) return 0;
    const completion = new Date(completionDate);
    const today = new Date();
    const timeDiff = completion.getTime() - today.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  // Helper function to count total tasks
  const countTotalTasks = (taskTimeline) => {
    if (!taskTimeline || !Array.isArray(taskTimeline)) return 0;
    return taskTimeline.reduce((count, stage) => {
      return count + (stage.tasks?.length || 0);
    }, 0);
  };

  // Helper function to count overdue invoices
  const countOverdueInvoices = async (projectId) => {
    try {
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('projectRef', '==', doc(db, 'projects', projectId))
      );
      
      const snapshot = await getDocs(invoicesQuery);
      let overdueCount = 0;
      
      snapshot.docs.forEach(docSnap => {
        const invoiceData = docSnap.data();
        if (invoiceData.status === 'overdue') {
          overdueCount++;
        }
      });
      
      return overdueCount;
    } catch (err) {
      console.error("Error counting overdue invoices:", err);
      return 0;
    }
  };

  // Fetch projects managed by this project manager
  useEffect(() => {
    if (!user || !isProjectManager) {
      setProjects([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectsRef = collection(db, "projects");
    const managerRef = doc(db, "users", user.uid);
    const q = query(projectsRef, where("projectManager", "==", managerRef));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const projectPromises = snapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          
          // Resolve projectUsers references
          let projectUsersData = [];
          let clientName = 'Client not assigned';
          let clientEmail = '';
          
          if (data.projectUsers && Array.isArray(data.projectUsers)) {
            const userPromises = data.projectUsers.map(async (userRef) => {
              try {
                if (userRef && userRef.path) {
                  const userDoc = await getDoc(userRef);
                  
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    
                    return {
                      id: userDoc.id,
                      uid: userData.uid || userDoc.id,
                      displayName: userData.displayName || 'Unknown',
                      email: userData.email || '',
                      phoneNumber: userData.phoneNumber || userData.phone || '',
                      role: userData.role || '',
                      status: userData.status || '',
                      createdAt: userData.createdAt || '',
                      lastLogin: userData.lastLogin || null
                    };
                  }
                }
              } catch (err) {
                console.error("Error fetching project user:", err);
              }
              return null;
            });
            
            const users = await Promise.all(userPromises);
            projectUsersData = users.filter(u => u !== null);
            
            if (projectUsersData.length > 0) {
              clientName = projectUsersData[0].displayName;
              clientEmail = projectUsersData[0].email;
            }
          }

          // Resolve successManagers references
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

          // Calculate additional project metrics
          const daysRemaining = calculateDaysRemaining(data.completionDate);
          const totalTasks = countTotalTasks(data.taskTimeline);
          const overdueInvoices = await countOverdueInvoices(docSnapshot.id);

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
            taskTimeline: data.taskTimeline || [],
            projectUsers: projectUsersData,
            successManagers: successManagersData,
            clientName: clientName,
            clientEmail: clientEmail,
            // New metrics
            daysRemaining,
            totalTasks,
            overdueInvoices
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