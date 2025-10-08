"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const ProjectUsersContext = createContext();

export const ProjectUsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Fetch consultation registrations
        const leadsSnap = await getDocs(collection(db, "consultation-registrations"));
        const leads = leadsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          _type: "lead"
        }));

        // Fetch users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersList = usersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data(), _type: "user" }))
          .filter(user => {
            const role = user.role?.toLowerCase();
            return !role || !["project manager", "success manager", "admin"].includes(role);
          });

        setUsers([...leads, ...usersList]);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <ProjectUsersContext.Provider value={{ users, loading, error }}>
      {children}
    </ProjectUsersContext.Provider>
  );
};

export const useProjectUsers = () => {
  const context = useContext(ProjectUsersContext);
  if (context === undefined) {
    throw new Error("useProjectUsers must be used within a ProjectUsersProvider");
  }
  return context;
};
