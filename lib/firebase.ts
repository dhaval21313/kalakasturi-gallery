import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern initialization to prevent multiple connection attempts
// Guard ensures initialization only runs when API key is present (prevents build-time crashes)
const app =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ? getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp()
    : (null as unknown as ReturnType<typeof initializeApp>);

const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>);
const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>);

export { app, db, auth };
