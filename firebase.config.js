// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB9w3o5S2aNLmQcAXMrx9r3Oyil1efZwQ",
  authDomain: "snapdock-4cc13.firebaseapp.com",
  projectId: "snapdock-4cc13",
  storageBucket: "snapdock-4cc13.firebasestorage.app",
  messagingSenderId: "552467271522",
  appId: "1:552467271522:web:00f685a24ee9ec0a82663b",
  measurementId: "G-XE58VY6F6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


