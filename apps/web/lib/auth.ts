import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

function ensureFirebaseAdmin() {
  if (getApps().length) {
    return;
  }

  let serviceAccount;
  
  // Try using complete service account JSON first (recommended)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
    }
  }
  
  // Fallback to individual environment variables
  if (!serviceAccount) {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Handle different private key formats
    if (privateKey) {
      // If it's base64 encoded, decode it
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        try {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        } catch (e) {
          console.log('Private key is not base64, using as-is');
        }
      }
      
      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    };
  }

  // Only initialize if we have at least the basic fields to avoid build-time errors
  const projectId = serviceAccount?.projectId || (serviceAccount as any)?.project_id;
  if (projectId && serviceAccount?.clientEmail && serviceAccount?.privateKey) {
    try {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (err) {
      console.error('Firebase Admin initialization error:', err);
    }
  } else {
    console.warn('Firebase Admin credentials missing or incomplete. Authentication features may fail at runtime.');
  }
}

export async function verifyFirebaseToken(token: string) {
  try {
    ensureFirebaseAdmin();
    if (!getApps().length) {
      throw new Error('Firebase Admin not initialized - missing credentials');
    }
    const authInstance = getAuth();
    const decodedToken = await authInstance.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}

export const auth = {
  verifyIdToken: async (token: string) => {
    ensureFirebaseAdmin();
    if (!getApps().length) {
      throw new Error('Firebase Admin not initialized');
    }
    return getAuth().verifyIdToken(token);
  }
} as any;