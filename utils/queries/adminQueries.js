import { collection, query, where, getDocs, limit, startAfter, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export const fetchAdminsPaginated = async ({ pageParam = null }) => {
  try {
    const rolesRef = collection(db, 'users')
    let q = query(
      rolesRef, 
      where('role', '==', 'admin'),
      orderBy('createdAt', 'desc'),
      limit(10)
    )

    if (pageParam) {
      q = query(
        rolesRef, 
        where('role', '==', 'admin'),
        orderBy('createdAt', 'desc'),
        startAfter(pageParam),
        limit(10)
      )
    }

    const snapshot = await getDocs(q)
    const admins = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const lastVisible = snapshot.docs[snapshot.docs.length - 1]
    
    return {
      admins,
      nextCursor: lastVisible,
      hasMore: snapshot.docs.length === 10
    }
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw error
  }
}
