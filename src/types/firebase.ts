import type { Timestamp } from 'firebase/firestore';

/**
 * Firebase configuration interface
 */
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Helper type for Firestore Timestamps
 */
export type FirestoreTimestamp = Timestamp | Date;

/**
 * Auth user type from Firebase
 * Using type-only import to avoid runtime issues
 */
export type AuthUser = import('firebase/auth').User | null;

/**
 * Auth state interface
 */
export interface AuthState {
  user: AuthUser;
  loading: boolean;
  error: string | null;
}

