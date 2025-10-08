// utils/addProjectToFirestore.js
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function addProjectToFirestore(projectData) {
  try {
    // Add timestamp and additional metadata
    const projectWithMetadata = {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'active' 
    };

    const docRef = await addDoc(collection(db, 'projects'), projectWithMetadata);
    console.log('Project created with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error in addProjectToFirestore:', error);
    throw error; // Re-throw to handle in the component
  }
}