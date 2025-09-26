'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function withAuthProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const auth = getAuth(app);
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          // User is not logged in, redirect to login page
          router.replace("/login");
          return;
        }
        
        // User is logged in, allow access to the component
        setLoading(false);
      });

      // Cleanup subscription
      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}