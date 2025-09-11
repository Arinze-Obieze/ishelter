'use client';
import { useState } from 'react';
import { FiSend} from 'react-icons/fi';
import { getAuth, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';
import { app as firebaseApp} from '@/lib/firebase';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';


// Sample user data
const users = [
 
];

const UserManagement = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading('Sending invitation...');

    try {
      // Call API to check user and get action
      const res = await fetch('/api/invite-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      const auth = getAuth(firebaseApp);

      if (data.error) {
        toast.error(`Server error: ${data.error}`, { id: toastId });
        setIsLoading(false);
        return;
      }

      if (data.status === 'send-magic-link') {
        // Send magic link
        await sendSignInLinkToEmail(auth, email, {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/finishSignIn`,
          handleCodeInApp: true,
        });
        window.localStorage.setItem('emailForSignIn', email);
        toast.success('Magic sign-in link sent!', { id: toastId });
      } else if (data.status === 'send-password-reset') {
        await sendPasswordResetEmail(auth, email);
        toast.success('Password reset link sent!', { id: toastId });
      } else {
        toast.error('Unknown response from server.', { id: toastId });
      }
      
      setEmail(""); 
    } catch (err) {
      toast.error('Error: ' + err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      {/* Toaster component for notifications */}
      <Toaster
        position="top-center"
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 5000,
          className: '',
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3B82F6',
              secondary: 'white',
            },
          },
        }}
      />

      {/* Main Content */}
      <div>
        <div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create New User</h2>
                    <p className="text-gray-600 mt-2">Enter the user's email address to send them an invitation or password reset link.</p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="user@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full md:w-auto px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          Send Invitation
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Recent Activity Section */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent User Invitations</h3>
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Sent
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status === "Completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;