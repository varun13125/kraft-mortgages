import admin from "firebase-admin";

let app: admin.app.App | null = null;

export type FirebaseServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function normalizePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return raw;
  let key = raw;
  // Support base64-encoded keys (common when pasting into dashboards)
  if (!key.includes("BEGIN PRIVATE KEY")) {
    try {
      const decoded = Buffer.from(key, "base64").toString("utf-8");
      if (decoded.includes("BEGIN PRIVATE KEY")) key = decoded;
    } catch {
      // not base64 - use as-is
    }
  }
  // Replace literal "\n" sequences with real newlines
  return key.replace(/\\n/g, "\n");
}

function fromJson(json: string | undefined): FirebaseServiceAccount | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    const projectId = parsed.projectId || parsed.project_id;
    const clientEmail = parsed.clientEmail || parsed.client_email;
    const privateKey = normalizePrivateKey(parsed.privateKey || parsed.private_key);
    if (projectId && clientEmail && privateKey) {
      return { projectId, clientEmail, privateKey };
    }
  } catch {
    console.error("[firebaseAdmin] Failed to parse service account JSON env var");
  }
  return null;
}

/**
 * Single source of truth for Firebase Admin credentials.
 *
 * Historically three modules initialised Firebase Admin with DIFFERENT env var
 * names (FIREBASE_SERVICE_ACCOUNT vs FIREBASE_SERVICE_ACCOUNT_JSON vs the split
 * FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). Whichever
 * module ran first in a given lambda "won", which could leave the default app
 * initialised without credentials (silently breaking lead writes, token
 * verification and the blog/run store). All initialisers now use this helper.
 *
 * Accepted (in priority order):
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON  - full service-account JSON
 *  2. FIREBASE_SERVICE_ACCOUNT       - full service-account JSON (legacy name)
 *  3. FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
 */
export function getServiceAccountFromEnv(): FirebaseServiceAccount | null {
  const json =
    fromJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) ||
    fromJson(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (json) return json;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }
  return null;
}

export function ensureFirebase(): admin.app.App {
  if (app) return app;
  if (admin.apps.length) {
    app = admin.app();
    return app;
  }
  const creds = getServiceAccountFromEnv();
  try {
    if (creds) {
      app = admin.initializeApp({
        credential: admin.credential.cert(creds),
        projectId: creds.projectId,
      });
    } else {
      // Fall back to Application Default Credentials (works on GCP; on Vercel
      // Firestore calls will fail at call-time and surface as errors).
      console.warn("[firebaseAdmin] No Firebase service-account env vars found; using application default credentials.");
      app = admin.initializeApp();
    }
  } catch (err) {
    // Another module may have initialised concurrently
    if (admin.apps.length) {
      app = admin.app();
    } else {
      throw err;
    }
  }
  return app!;
}

export function firestore() {
  return ensureFirebase().firestore();
}
