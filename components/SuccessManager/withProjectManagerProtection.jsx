// components/SuccessManager/withProjectManagerProtection.jsx
'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);
const db = getFirestore(app);

export default function withProjectManagerProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [isProjectManager, setIsProjectManager] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "project manager") {
            setIsProjectManager(true);
          } else {
            // User is logged in but not a project manager
            router.replace("/login"); // Create this page

          }
        } catch (error) {
          console.error("Error checking project manager status:", error);
          router.replace("/login");
        } finally {
          setLoading(false);
          setAuthChecked(true);
        }
      });
      
      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // This prevents flash of content before redirect
    if (authChecked && !isProjectManager) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Redirecting...</p>
          </div>
        </div>
      );
    }

    return isProjectManager ? <WrappedComponent {...props} /> : null;
  };
}