// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// --- for emulation ---
// import { getApp } from 'firebase/app';
// import { connectAuthEmulator } from 'firebase/auth';
// import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
// --- for emulation ---
// connectAuthEmulator(auth, 'http://localhost:9099');
// const functions = getFunctions(getApp());
// connectFunctionsEmulator(functions, 'localhost', 5001);
