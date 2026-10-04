import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyBtydvvSshwC1hpCQlhsddjT1f39fD5rag",
  authDomain: "house-of-seetah-billing-app.firebaseapp.com",
  projectId: "house-of-seetah-billing-app",
  storageBucket: "house-of-seetah-billing-app.firebasestorage.app",
  messagingSenderId: "802632605495",
  appId: "1:802632605495:web:c34dfbfddacfaff7d004b2"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
