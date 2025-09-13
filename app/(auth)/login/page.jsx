"use client";
import { useState } from "react";
import { FaShieldAlt, FaSignInAlt } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Toaster, toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  const isDisabled = loading || !email || !password;

  function getErrorMessage(code) {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Try again.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      default:
        return "Login failed. Please try again.";
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : null;
      
      if (role === "admin") {
        toast.success("Successfully logged in as admin!", { duration: 3000 });
        router.push("/admin");
      } else {
        toast.success("Successfully logged in!", { duration: 3000 });
        router.push("/dashboard");
      }
    } catch (err) {
      const friendlyMessage = getErrorMessage(err.code);
      setError(friendlyMessage);
      toast.error(friendlyMessage, { duration: 3000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Toast Container */}
      <Toaster position="top-right" />
      
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
            <form className="space-y-5 " onSubmit={handleLogin}>
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
                <div className="text-right mt-1">
                  <a href="#" className="text-primary text-sm hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm mb-2">{error}</div>
              )}

              <button
                type="submit"
                disabled={isDisabled}
                className="w-full  cursor-pointer bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-400 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <FcGoogle size={20} /> Google Account
            </button>

            <p className="text-center mt-6 text-sm text-gray-600">
              New to iSHELTER?{" "}
              <a href="#" className="text-primary font-medium hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/3 h-screen">
        <img
          src="/login-bg.png"
          alt="Login background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}