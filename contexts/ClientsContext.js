"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ClientsContext = createContext();

// Helper function to parse cost from taskTimeline (same as TimelineTab)
const parseCost = (cost) => {
  if (!cost) return 0;
  if (typeof cost === "number") return cost;
  return parseInt(cost.toString().replace(/[^\d]/g, "")) || 0;
};

// Calculate total project value from taskTimeline
const calculateProjectValue = (taskTimeline) => {
  if (!Array.isArray(taskTimeline)) return 0;
  
  return taskTimeline.reduce((sum, stage) => {
    const stageCost = parseCost(stage.cost);
    const tasksCost = (stage.tasks || []).reduce((s, t) => s + parseCost(t.cost), 0);
    return sum + stageCost + tasksCost;
  }, 0);
};

// Format timestamp to relative time
const formatLastActivity = (timestamp) => {
  if (!timestamp) return "Never";
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) > 1 ? 's' : ''} ago`;
};

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Watch authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser(null);
        setClients([]);
        setLoading(false);
        return;
      }
      setCurrentUser(firebaseUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch and aggregate client data
  useEffect(() => {
    if (!currentUser) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Create reference to current project manager
    const projectManagerRef = doc(db, "users", currentUser.uid);
    
    // Query projects where projectManager equals current user
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("projectManager", "==", projectManagerRef));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        try {
          // Map to store aggregated client data
          const clientsMap = {};

          // Process each project
          for (const projectDoc of snapshot.docs) {
            const projectData = projectDoc.data();
            const projectValue = calculateProjectValue(projectData.taskTimeline);
            const projectUsers = projectData.projectUsers || [];

            // Process each client in the project
            for (const clientRef of projectUsers) {
              if (!clientRef || !clientRef.path) continue;

              const clientId = clientRef.id;

              // If client not yet in map, fetch their data
              if (!clientsMap[clientId]) {
                try {
                  const clientDoc = await getDoc(clientRef);
                  
                  if (clientDoc.exists()) {
                    const clientData = clientDoc.data();
                    
                    // Only include users with role "client"
                    if (clientData.role?.toLowerCase() === "client") {
                      // Determine primary contact (prioritize phone)
                      const hasPhone = clientData.phoneNumber && clientData.phoneNumber.trim() !== "";
                      const contactType = hasPhone ? "phone" : "email";
                      const contactValue = hasPhone 
                        ? clientData.phoneNumber 
                        : (clientData.email || "No contact");

                      clientsMap[clientId] = {
                        id: clientId,
                        name: clientData.displayName || clientData.email || "Unknown Client",
                        contact: {
                          type: contactType,
                          value: contactValue
                        },
                        projects: 0,
                        value: 0,
                        status: clientData.status || "Active",
                        lastActivity: formatLastActivity(clientData.lastLogin),
                        lastLoginTimestamp: clientData.lastLogin, // Keep for sorting
                        email: clientData.email,
                        phoneNumber: clientData.phoneNumber
                      };
                    }
                  }
                } catch (err) {
                  console.error(`Error fetching client ${clientId}:`, err);
                  // Skip this client if we can't fetch their data
                  continue;
                }
              }

              // Increment project count and add value
              if (clientsMap[clientId]) {
                clientsMap[clientId].projects += 1;
                clientsMap[clientId].value += projectValue;
              }
            }
          }

          // Convert map to array and format values
          const clientsArray = Object.values(clientsMap).map(client => ({
            ...client,
            value: `₦${client.value.toLocaleString()}`
          }));

          setClients(clientsArray);
          setError(null);
          setLoading(false);
        } catch (err) {
          console.error("Error processing clients:", err);
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        if (err.code === "permission-denied") {
          setError("You don't have permission to view clients. Please contact an administrator.");
          setClients([]);
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <ClientsContext.Provider value={{ clients, loading, error }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};