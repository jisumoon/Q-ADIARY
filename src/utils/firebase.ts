import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3NRUDgicaByPGbbolCcPd5Q44Y51NIsk",
  authDomain: "diary-bd6e8.firebaseapp.com",
  projectId: "diary-bd6e8",
  storageBucket: "diary-bd6e8.firebasestorage.app",
  messagingSenderId: "106068644922",
  appId: "1:106068644922:web:07c40075bcfe6e8aa45103",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase modules
export const auth = getAuth(app);
export const db = getFirestore(app);
