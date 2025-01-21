
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";  // Add this import

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDekOOLou4xWnkDiPPULcNwFnC4VRTjnaU",
    authDomain: "skydancers-1f122.firebaseapp.com",
    projectId: "skydancers-1f122",
    storageBucket: "skydancers-1f122.firebasestorage.app",
    messagingSenderId: "1072607664451",
    appId: "1:1072607664451:web:8aad2f9bba5e323bf6b7f6",
    measurementId: "G-52FEGQ92LJ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);  // Add this export