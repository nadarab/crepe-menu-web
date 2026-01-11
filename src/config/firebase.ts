// Firebase v12+ modular SDK imports
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import type { FirebaseConfig } from '../types/firebase';

/**
 * Firebase configuration from environment variables
 */
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate that all required Firebase config values are present
 */
const validateConfig = (config: FirebaseConfig): void => {
  const requiredFields: (keyof FirebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingFields = requiredFields.filter(
    (field) => !config[field] || config[field] === ''
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missingFields.join(', ')}. ` +
        'Please check your .env file and ensure all VITE_FIREBASE_* variables are set.'
    );
  }
};

// Validate configuration before initializing
validateConfig(firebaseConfig);

/**
 * Initialize Firebase App
 * Uses existing app if already initialized to prevent multiple instances
 */
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

/**
 * Initialize Firebase services
 */
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const auth = getAuth(app);

/**
 * Enable offline persistence for faster subsequent loads
 * Data will be cached locally and queries will be instant on repeated visits
 */
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('Firebase persistence not supported in this browser');
    }
  });
}

/**
 * Export Firebase app instance (for advanced usage if needed)
 */
export default app;

