"use client";
import { useState } from "react";
import Image from "next/image";
import { FaShieldAlt, FaSignInAlt, FaTimes } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { doc, 
  getDoc,  
  collection, 
  query, 
  where, 
  getDocs  } from "firebase/firestore";
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const isDisabled = loading || !email || !password;
  const isResetDisabled = resetLoading || !resetEmail;

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Set persistence based on "Remember Me" checkbox: local (indefinite) or session (tab close)
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check user role from Firestore (users collection)
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        if (role === "admin") {
          toast.success("Successfully logged in as admin!", { duration: 3000 });
          router.push("/admin");
        } else if (role === "project manager") {
          toast.success("Successfully logged in as project manager!", { duration: 3000 });
          router.push("/project-manager");
        } else if (role === "success manager") {
          toast.success("Successfully logged in as success manager!", { duration: 3000 });
          router.push("/success-manager");
        } else {
          toast.success("Successfully logged in!", { duration: 3000 });
          router.push("/dashboard");
        }
      } else {
        // Query consultation-registrations by email using the new rules
        const consultQuery = query(
          collection(db, "consultation-registrations"), 
          where("email", "==", email)
        );
        const consultSnapshot = await getDocs(consultQuery);
        
        if (!consultSnapshot.empty) {
          // User exists in consultation-registrations
          toast.success("Successfully logged in!", { duration: 3000 });
          router.push("/dashboard");
        } else {
          // User document doesn't exist in either collection
          toast.error("User account not properly configured. Please contact support.", { duration: 3000 });
          setError("Account configuration error. Please contact support.");
        }
      }
    } catch (err) {
      const friendlyMessage = err.code;
      setError(friendlyMessage);
      toast.error(friendlyMessage, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      // Send password reset email
      await sendPasswordResetEmail(auth, resetEmail);
      
      toast.success("Password reset email sent! Check your inbox.", { duration: 4000 });
      
      // Close modal and reset form
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (err) {
      let errorMessage = "Failed to send reset email. Please try again.";
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many attempts. Please try again later.";
      }
      
      toast.error(errorMessage, { duration: 4000 });
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed backdrop-overlay flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
            <p className="text-text text-sm font-light mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isResetDisabled}
                className="w-full cursor-pointer bg-primary hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {resetLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="flex items-center justify-center">
                <span className="text-green-600 text-xs flex items-center font-light">
                  <FaShieldAlt className="mr-1" />
                  Secure password reset via email
                </span>
              </div>
            </form>

            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetEmail("");
              }}
              className="w-full mt-4 text-primary text-sm font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="flex flex-col w-full md:w-2/3 shadow-lg overflow-y-auto">
        <div className="flex w-full justify-between items-center px-6 md:px-16 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-primary">i</span>SHELTER
          </h1>
          <button className="flex items-center gap-2 text-text text-base font-light hover:text-primary transition-colors">
            Log In <FaSignInAlt className="text-primary" />
          </button>
        </div>

        <div className="flex bg-white flex-1 items-center max-md:mx-4 justify-center px-6 md:px-6 pb-10">
          <div className="w-full max-w-md">
            <form className="space-y-5" onSubmit={handleLogin}>
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-text text-base font-light mb-6">
                Log in to access your iSHELTER dashboard and manage your projects
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>
                
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-primary text-sm hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-2">{error}</div>
              )}

              <button
                type="submit"
                disabled={isDisabled}
                className="w-full cursor-pointer bg-primary hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Log In to Your Account"
                )}
              </button>

              <div className="flex items-center justify-center mt-2">
                <span className="text-green-600 text-xs flex items-center font-light">
                  <FaShieldAlt className="mr-1" />
                  Your connection to this site is secure and encrypted
                </span>
              </div>
            </form>

            {/* <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <FcGoogle size={20} /> Google Account
            </button> */}
          </div>
        </div>
      </div>

    <div className="hidden md:flex w-1/3 h-screen relative">
        <Image
          src="/login-bg.png"
          alt="Login background"
          fill
          className="object-cover"
          priority
          sizes="33vw"
        />
      </div>
    </div>
  );
}