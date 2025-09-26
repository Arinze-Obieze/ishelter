import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const updateLastLogin = async (userId) => {
  if (!userId) return;
  
  try {
    await setDoc(
      doc(db, 'users', userId),
      {
        lastLogin: serverTimestamp() 
      },
      { merge: true } // This is key - only updates specified fields
    );
  } catch (error) {
    console.error('Error updating last login:', error);
  }
};