import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const fetchProjectManagers = async () => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('role', '==', 'project manager'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
