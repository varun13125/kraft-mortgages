import { initializeApp, getApps, type FirebaseApp } from "firebase/app";

/**
 * Firebase web (client SDK) app - used ONLY for admin sign-in (/login, /dashboard).
 * No client code reads or writes Firestore directly (all data access is
 * server-side through the Admin SDK), and firestore.rules denies all client
 * access, so the Firestore client SDK is intentionally not initialised here.
 *
 * BUG-050: there used to be a silent `dummy-project` fallback config, which hid
 * a missing configuration behind confusing auth errors. Now `app` is null and
 * `firebaseConfigured` is false when the NEXT_PUBLIC_FIREBASE_* vars are missing;
 * pages that need Firebase must check it. Pages that don't are unaffected.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

if (!firebaseConfigured) {
  console.error(
    "[firebase] Not configured: set NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, " +
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_APP_ID. Admin login is disabled."
  );
}

export const app: FirebaseApp | null = firebaseConfigured
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;
