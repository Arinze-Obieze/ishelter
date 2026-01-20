'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Roles that are NOT allowed to access this layout
const RESTRICTED_ROLES = ['admin', 'success manager', 'project manager'];

export default function withAuthProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const auth = getAuth(app);
      
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          // User is not logged in, redirect to login page
          router.replace("/login");
          return;
        }
        
        try {
          // OPTIMIZATION: Check custom claims instead of Firestore fetch
          const idTokenResult = await user.getIdTokenResult();
          const userRole = idTokenResult.claims.role;
            
          // Check if user has a RESTRICTED role
          if (RESTRICTED_ROLES.includes(userRole)) {
            // User has a restricted role, redirect to unauthorized or dashboard
            router.replace("/unauthorized");
            return;
          }
            
          // User doesn't have restricted role, allow access
          setLoading(false);
        } catch (error) {
          console.error("Error checking auth status:", error);
          router.replace("/login");
        }
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