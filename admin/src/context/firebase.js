
   // src/context/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

   // Your web app's Firebase configuration
   const firebaseConfig = {
     apiKey: "AIzaSyCKagd1JqhXx6FlgtklrJqYvzQOOTqzwo0",
     authDomain: "my-amrita-eec28.firebaseapp.com",
     projectId: "my-amrita-eec28",
     storageBucket: "my-amrita-eec28.firebasestorage.app",
     messagingSenderId: "908754249346",
     appId: "1:908754249346:web:2ce2013e26ed933b07f69b",
     measurementId: "G-YSK735ND1H"
   };


const app = initializeApp(firebaseConfig); // Initialize Firebase
const db = getFirestore(app); // Firestore instance
const auth = getAuth(app); // Firebase Auth instance
const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
const analytics = getAnalytics(app); // Firebase Analytics (optional)

export { app, db, auth, googleProvider, analytics };