'use client'
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function withAuthProtection(WrappedComponent) {
  return function ProtectedComponent(props) {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
        if (!user) {
          router.replace("/login");
          return;
        }
        // Check if user doc exists
        const userRef = doc(db, "users", user.uid);
        let userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          // Create user doc with password: false
          await setDoc(userRef, {
            email: user.email,
            password: false,
            createdAt: new Date(),
          });
          router.replace("/complete-profile");
          return;
        }
        // Check if password is set
        if (!userDoc.data().password) {
          router.replace("/complete-profile");
          return;
        }
        setAllowed(true);
        setLoading(false);
      });
      return () => unsubscribe();
    }, [router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      );
    }
    if (!allowed) return null;
    return <WrappedComponent {...props} />;
  };
}
