import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyAsYpyywNrvt3lkZx9F74jbPdlp_y4O6Zo",
  authDomain: "flutter-ai-playground-2e118.firebaseapp.com",
  projectId: "flutter-ai-playground-2e118",
  storageBucket: "flutter-ai-playground-2e118.firebasestorage.app",
  messagingSenderId: "904312838032",
  appId: "1:904312838032:android:7e3a4739a713a1ada30515",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics
export const initializeAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
