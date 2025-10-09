"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const PersonalProjectsContext = createContext();

export const PersonalProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Watch authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsAdmin(false);
        setProjects([]);
        setLoading(false);
        return;
      }

      console.log("UID:", firebaseUser.uid);
      console.log("Email:", firebaseUser.email);

      setUser(firebaseUser);

      // ✅ Check user role in /users collection
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const role = snap.data().role;
          const adminRoles = ["admin", "projectManager", "successManager"];
          setIsAdmin(adminRoles.includes(role));
        } else {
          setIsAdmin(false); // Normal user (may exist in consultation-registrations)
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setIsAdmin(false);
      }
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
    const q = isAdmin
      ? query(projectsRef) // Admins/managers see all projects
      : query(projectsRef, where("ownerId", "==", user.uid)); // Normal users see only their own

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userProjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
    console.log(projects)

    return () => unsubscribe();
  }, [user, isAdmin]);

  return (
    <PersonalProjectsContext.Provider
      value={{ projects, loading, error, isAdmin }}
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
