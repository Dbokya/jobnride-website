import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth, db } from '../firebase'; // ✅ use 'db' instead of 'firestore'
import { doc, getDoc } from 'firebase/firestore';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try{
        const docRef = doc(db, 'users', firebaseUser.uid); // ✅ db here
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().isAdmin) {
          setAdminUser(firebaseUser);
        } else {
          setAdminUser(null);
        }}catch(error){
          console.error("Error fetching admin user:", error);
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(()=> ({
    adminUser,
    loading,
  }), [adminUser, loading]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
