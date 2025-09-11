'use client';
import { useState } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiSettings, 
  FiBell, 
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSearch,
  FiSend
} from 'react-icons/fi';
import { getAuth, sendSignInLinkToEmail, sendPasswordResetEmail } from 'firebase/auth';
import firebaseApp from '@/lib/firebase';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

// Navigation items array
const navItems = [
  { name: "Dashboard", icon: <FiHome className="w-5 h-5 mr-3" />, href: "#" },
  { name: "Users", icon: <FiUsers className="w-5 h-5 mr-3" />, href: "#" },
  { name: "Reports", icon: <FiFileText className="w-5 h-5 mr-3" />, href: "#" },
  { name: "Settings", icon: <FiSettings className="w-5 h-5 mr-3" />, href: "#" }
];

// Sample user data
const users = [
  { id: 1, email: "alex.johnson@example.com", status: "Pending", date: "May 15, 2023" },
  { id: 2, email: "sarah.williams@example.com", status: "Completed", date: "May 12, 2023" },
  { id: 3, email: "michael.brown@example.com", status: "Pending", date: "May 10, 2023" },
  { id: 4, email: "emma.davis@example.com", status: "Completed", date: "May 8, 2023" }
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sendWelcome, setSendWelcome] = useState(true);
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
      
      if (data.status === 'send-magic-link') {
        // Send magic link
        await sendSignInLinkToEmail(auth, email, {
          url: `${window.location.origin}/finishSignIn`,
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
    <div className="min-h-screen bg-gray-50 flex">
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
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed md:relative w-64 bg-white shadow-sm transform transition-transform duration-300 z-30 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h2>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href} 
                  className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.icon}
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4 relative">
                <FiBell className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </div>
              <div className="flex items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                  <span className="text-indigo-800 font-medium">A</span>
                </div>
                <span className="text-gray-700 mr-1">Admin</span>
                <FiChevronDown className="text-gray-500" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
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

export default AdminDashboard;