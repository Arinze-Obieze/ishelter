// components/Admin/withAdminProtection.jsx
'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../../lib/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);
const db = getFirestore(app);

export default function withAdminProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
          } else {
            router.replace("/admin");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          router.replace("/login");
        } finally {
          setLoading(false);
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
    
    if (!isAdmin) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
}