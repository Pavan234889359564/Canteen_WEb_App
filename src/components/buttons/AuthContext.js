import React, { useContext, createContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Import your initialized Firebase auth config
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Create the AuthContext
const AuthContext = createContext();

// Create the provider to wrap your application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Google Sign-In function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  // Email/Password Sign-In function
  const emailPasswordSignIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logOut = async () => {
    await signOut(auth);
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // The value provided by the context
  return (
    <AuthContext.Provider
      value={{
        user, // Current user object
        googleSignIn,
        emailPasswordSignIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Use the context in your app
export const UserAuth = () => {
  return useContext(AuthContext);
};