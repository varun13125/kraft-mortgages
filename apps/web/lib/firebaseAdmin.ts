import admin from "firebase-admin";

let app: admin.app.App | null = null;

export function ensureFirebase(): admin.app.App {
  if (app) return app;
  try {
    if (!admin.apps.length) {
      const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (svc) {
        const creds = JSON.parse(svc);
        app = admin.initializeApp({ credential: admin.credential.cert(creds) });
      } else {
        app = admin.initializeApp();
      }
    } else {
      app = admin.app();
    }
  } catch (err) {
    // Fallback to default init (use ADC if available)
    if (!admin.apps.length) app = admin.initializeApp();
  }
  return app!;
}

export function firestore() {
  return ensureFirebase().firestore();
}

