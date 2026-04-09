// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzkXvz9y1qxvg4m71djbwCPalcpiOztsk",
  authDomain: "summarist-e8d1f.firebaseapp.com",
  projectId: "summarist-e8d1f",
  storageBucket: "summarist-e8d1f.firebasestorage.app",
  messagingSenderId: "249789914980",
  appId: "1:249789914980:web:3d6f70a19b8fe9354f6471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();