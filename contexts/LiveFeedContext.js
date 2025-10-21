import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, onSnapshot, getDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { db, storage } from "../lib/firebase"
import { useUsers } from "./UserContext"

const LiveFeedContext = createContext()

export function LiveFeedProvider({ children }) {
  const { user } = useUsers()
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
        const updateSnap = await getDoc(refObj)
        return { id: updateSnap.id, ...updateSnap.data() }
      })
      const updatesArr = await Promise.all(promises)
      // Sort by createdAt desc
      setUpdates(updatesArr.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds))
    })
    return () => unsub && unsub()
  }, [])

  // Upload files to Firebase Storage and return array of metadata
  const uploadFiles = async (files, projectId, onProgress) => {
    const uploaded = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const storageRef = ref(storage, `projects/${projectId}/liveUpdates/${Date.now()}_${file.name}`)
      const uploadTask = uploadBytesResumable(storageRef, file)
      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            if (onProgress) onProgress(i, snapshot.bytesTransferred / snapshot.totalBytes)
          },
          (err) => reject(err),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            uploaded.push({ url, contentType: file.type, name: file.name, size: file.size })
            resolve()
          }
        )
      })
    }
    return uploaded
  }

  // Post a new update and add its reference to the project doc
  const postUpdate = async ({ projectId, description, updateType, isInternal, media }) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Create new update doc in liveUpdates
      const updateDocRef = await addDoc(collection(db, "liveUpdates"), {
        projectId,
        description,
        updateType,
        isInternal,
        media,
        createdBy: user ? {
          uid: user.uid,
          name: user.displayName || user.name || "",
          email: user.email,
          photoURL: user.photoURL || ""
        } : null,
        createdAt: serverTimestamp()
      })
      // 2. Add reference to project doc's liveFeedRefs array
      const projectDocRef = doc(db, "projects", projectId)
      await updateDoc(projectDocRef, {
        liveFeedRefs: arrayUnion(updateDocRef)
      })
      setLoading(false)
      return updateDocRef
    } catch (err) {
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return (
    <LiveFeedContext.Provider value={{ updates, loading, error, subscribeToUpdates, postUpdate, uploadFiles }}>
      {children}
    </LiveFeedContext.Provider>
  )
}

export function useLiveFeed() {
  return useContext(LiveFeedContext)
}
