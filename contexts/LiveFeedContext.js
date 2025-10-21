import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc, deleteDoc, increment, deleteField } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db, storage, auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { toast } from "react-hot-toast"

const LiveFeedContext = createContext()

export function LiveFeedProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  
  // Get current authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore to get displayName
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid)
          const userDoc = await getDoc(userDocRef)
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: userData.displayName || userData.name || firebaseUser.displayName || firebaseUser.email,
              photoURL: userData.photoURL || firebaseUser.photoURL || "",
              name: userData.displayName || userData.name || firebaseUser.email
            })
          } else {
            // Fallback to Firebase Auth data
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || firebaseUser.email,
              photoURL: firebaseUser.photoURL || "",
              name: firebaseUser.displayName || firebaseUser.email
            })
          }
        } catch (err) {
          console.error("Error fetching user data:", err)
          // Fallback to Firebase Auth data
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email,
            photoURL: firebaseUser.photoURL || "",
            name: firebaseUser.displayName || firebaseUser.email
          })
        }
      } else {
        setCurrentUser(null)
      }
    })
    
    return () => unsubscribe()
  }, [])
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Subscribe to live updates for a project using DocumentReferences in project doc
  const subscribeToUpdates = useCallback((projectId) => {
    if (!projectId) return () => {}
    const projectDocRef = doc(db, "projects", projectId)
    let unsub = null
    // Listen to project doc for liveFeedRefs
    unsub = onSnapshot(projectDocRef, async (projectSnap) => {
      const refs = projectSnap.data()?.liveFeedRefs || []
      if (refs.length === 0) {
        setUpdates([])
        return
      }
      // Fetch all referenced update docs
      const promises = refs.map(async (refObj) => {
        try {
          const updateSnap = await getDoc(refObj)
          if (updateSnap.exists()) {
            return { id: updateSnap.id, ...updateSnap.data() }
          }
        } catch (err) {
          console.error("Error fetching update:", err)
        }
        return null
      })
      const updatesArr = (await Promise.all(promises)).filter(u => u !== null)
      // Sort by createdAt desc
      setUpdates(updatesArr.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds))
    })
    return () => unsub && unsub()
  }, [])

  // Upload files to Firebase Storage and return array of metadata
  const uploadFiles = async (files, projectId, onProgress) => {
    const uploaded = []
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`)
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const storageRef = ref(storage, `projects/${projectId}/liveUpdates/${Date.now()}_${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = snapshot.bytesTransferred / snapshot.totalBytes
              if (onProgress) onProgress(i, progress)
              toast.loading(`Uploading ${file.name}: ${Math.round(progress * 100)}%`, { id: toastId })
            },
            (err) => {
              console.error("Upload error:", err)
              reject(err)
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref)
              uploaded.push({ 
                url, 
                contentType: file.type, 
                name: file.name, 
                size: file.size 
              })
              resolve()
            }
          )
        })
      }
      
      toast.success(`${files.length} file(s) uploaded successfully`, { id: toastId })
      return uploaded
    } catch (err) {
      toast.error("Failed to upload files", { id: toastId })
      throw err
    }
  }

  // Post a new update and add its reference to the project doc
  const postUpdate = async ({ projectId, description, updateType, media }) => {
    if (!currentUser) {
      toast.error("You must be logged in to post updates")
      console.error("No current user found")
      return
    }

    setLoading(true)
    setError(null)
    const toastId = toast.loading("Posting update...")
    
    try {
      // 1. Create new update doc in liveUpdates
      const updateDocRef = await addDoc(collection(db, "liveUpdates"), {
        projectId,
        description,
        updateType,
        media: media || [],
        createdBy: {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.name || currentUser.email || "Unknown User",
          email: currentUser.email,
          photoURL: currentUser.photoURL || ""
        },
        createdAt: serverTimestamp()
      })

      // 2. Add reference to project doc's liveFeedRefs array
      const projectDocRef = doc(db, "projects", projectId)
      await updateDoc(projectDocRef, {
        liveFeedRefs: arrayUnion(updateDocRef),
        // Increment update type count
        [`updateTypeCounts.${updateType}`]: increment(1)
      })

      setLoading(false)
      toast.success("Update posted successfully!", { id: toastId })
      return updateDocRef
    } catch (err) {
      console.error("Error posting update:", err)
      setError(err)
      setLoading(false)
      toast.error("Failed to post update. Please try again.", { id: toastId })
      throw err
    }
  }

  // Delete an update and decrement type count
  const deleteUpdate = async (updateId, projectId, updateType) => {
    const toastId = toast.loading("Deleting update...")
    
    try {
      const updateDocRef = doc(db, "liveUpdates", updateId)
      const projectDocRef = doc(db, "projects", projectId)

      // Remove reference from project
      await updateDoc(projectDocRef, {
        liveFeedRefs: arrayRemove(updateDocRef),
        [`updateTypeCounts.${updateType}`]: increment(-1)
      })

      // Delete the update document
      await deleteDoc(updateDocRef)

      // Check if count is 0 and remove type if needed
      const projectSnap = await getDoc(projectDocRef)
      const counts = projectSnap.data()?.updateTypeCounts || {}
      if (counts[updateType] === 0) {
        await updateDoc(projectDocRef, {
          [`updateTypeCounts.${updateType}`]: deleteField()
        })
      }

      toast.success("Update deleted successfully", { id: toastId })
      return true
    } catch (err) {
      console.error("Error deleting update:", err)
      toast.error("Failed to delete update", { id: toastId })
      return false
    }
  }

  // Get update types for a project
  const getUpdateTypes = async (projectId) => {
    try {
      const projectDocRef = doc(db, "projects", projectId)
      const projectSnap = await getDoc(projectDocRef)
      const counts = projectSnap.data()?.updateTypeCounts || {}
      return Object.keys(counts).filter(type => counts[type] > 0)
    } catch (err) {
      console.error("Error fetching update types:", err)
      return []
    }
  }

  return (
    <LiveFeedContext.Provider value={{ 
      updates, 
      loading, 
      error, 
      subscribeToUpdates, 
      postUpdate, 
      uploadFiles,
      deleteUpdate,
      getUpdateTypes
    }}>
      {children}
    </LiveFeedContext.Provider>
  )
}

export function useLiveFeed() {
  return useContext(LiveFeedContext)
}