import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function getProjectNameById(projectId) {
  if (!projectId) return null;
  try {
    const docRef = doc(db, 'projects', projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().projectName || 'Project';
    }
    return 'Project';
  } catch (e) {
    return 'Project';
  }
}
