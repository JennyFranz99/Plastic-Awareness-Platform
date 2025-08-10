// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHolNcJ52tQEh6mK9h-9a_pjKO-tnrGdQ",
  authDomain: "plastic-awareness-platform.firebaseapp.com",
  projectId: "plastic-awareness-platform",
  storageBucket: "plastic-awareness-platform.firebasestorage.app",
  messagingSenderId: "927568247152",
  appId: "1:927568247152:web:e9db1499577ee6308177b5",
  measurementId: "G-81EHSG3ZXE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  getAnalytics(app);
}

export default app;