// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvDESPdLvN--qVWpBG8OKhu9gGJ5iPhC0",
  authDomain: "erp-master-565f8.firebaseapp.com",
  projectId: "erp-master-565f8",
  storageBucket: "erp-master-565f8.firebasestorage.app",
  messagingSenderId: "985094109854",
  appId: "1:985094109854:web:857343a1378f8148a3998f",
  measurementId: "G-CLC1WTW9Q6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
