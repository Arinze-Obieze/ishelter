import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { updateLastLogin } from '@/lib/updateLastLogin';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track authentication and update last login
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Only update lastLogin field, preserve everything else
        updateLastLogin(user.uid);
        
        // Fetch current user's data directly (this should work with security rules)
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUserData({
              id: userDoc.id,
              ...userDoc.data()
            });
          }
        } catch (err) {
          console.error("Error fetching current user data:", err);
        }
      } else {
        setCurrentUserData(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch users - but handle permission errors gracefully
  useEffect(() => {
    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(usersQuery, 
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore users collection error:", err);
        
        // If it's a permission error, that's expected for non-admin users
        if (err.code === 'permission-denied') {
          console.log("User doesn't have permission to read all users - this is normal for clients");
          setUsers([]); // Empty array instead of error
          setError(null);
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper function to get current user - maintains backward compatibility
  const getCurrentUser = () => {
    return currentUserData || users.find(user => user.id === auth.currentUser?.uid);
  };

  // Helper function to find user by ID - maintains backward compatibility
  const getUserById = (userId) => {
    return users.find(user => user.id === userId) || currentUserData;
  };

  const value = {
    // Backward compatible properties
    users,
    loading,
    error,
    
    // New properties for better data access
    currentUser: getCurrentUser(),
    getUserById,
    
    // Alias for backward compatibility (if your code uses currentUser)
    currentUserData: getCurrentUser(),
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};