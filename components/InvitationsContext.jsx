'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const InvitationsContext = createContext([]);

export const useInvitations = () => useContext(InvitationsContext);

export const InvitationsProvider = ({ children }) => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "invitations"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInvitations(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <InvitationsContext.Provider value={invitations}>
      {children}
    </InvitationsContext.Provider>
  );
};
