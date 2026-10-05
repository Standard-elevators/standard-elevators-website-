import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

/**
 * Firebase Client Configuration
 * Loaded securely from environment variables.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Validate presence of required configuration variables
 */
export function validateFirebaseConfig(): { isValid: boolean; missingKeys: string[] } {
  const requiredKeys: (keyof typeof firebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];

  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
}

/**
 * Singleton Firebase App Initialization
 * Ensures Firebase is initialized only once across hot reloads and SSR.
 */
export const app: FirebaseApp = (() => {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(firebaseConfig);
})();

/**
 * Firebase Auth instance
 */
export const auth: Auth = getAuth(app);

/**
 * Cloud Firestore instance
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Storage instance
 */
export const storage: FirebaseStorage = getStorage(app);

/**
 * Client-side Analytics (SSR-safe)
 */
let analyticsPromise: Promise<Analytics | null> | null = null;

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") {
    return null;
  }
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) => {
      if (supported) {
        return getAnalytics(app);
      }
      return null;
    });
  }
  return analyticsPromise;
}
