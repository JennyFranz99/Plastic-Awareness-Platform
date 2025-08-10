// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHolNcJ52tQEh6mK9h-9a_pjKO-tnrGdQ",
  authDomain: "plastic-awareness-platform.firebaseapp.com",
  projectId: "plastic-awareness-platform",
  storageBucket: "plastic-awareness-platform.firebasestorage.app",
  messagingSenderId: "927568247152",
  appId: "1:927568247152:web:353494942c7688688177b5",
  measurementId: "G-8Z56EQJX9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);