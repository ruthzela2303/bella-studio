import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGSVHmsq_kssWtE7TyEIyVfH_KQI8xjeI",
  authDomain: "bella-c0a0d.firebaseapp.com",
  projectId: "bella-c0a0d",
  storageBucket: "bella-c0a0d.firebasestorage.app",
  messagingSenderId: "127656122972",
  appId: "1:127656122972:web:60ae0520f1a54a74e36499",
  measurementId: "G-P6M6YR9MX7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);