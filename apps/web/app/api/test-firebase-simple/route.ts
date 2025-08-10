import { NextResponse } from 'next/server';

export async function GET() {
  const result: any = {
    timestamp: new Date().toISOString(),
    env: {
      hasServiceAccountJson: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    }
  };

  // Try to parse service account JSON if it exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      result.serviceAccountParsed = {
        hasType: !!parsed.type,
        hasProjectId: !!parsed.project_id,
        hasPrivateKey: !!parsed.private_key,
        hasClientEmail: !!parsed.client_email,
        projectId: parsed.project_id,
        clientEmailPrefix: parsed.client_email?.substring(0, 20) + '...',
        privateKeyPrefix: parsed.private_key?.substring(0, 50) + '...',
      };
    } catch (e) {
      result.parseError = e instanceof Error ? e.message : 'Unknown error';
    }
  }

  // Try to initialize Firebase Admin
  try {
    const admin = await import('firebase-admin');
    
    if (!admin.apps.length) {
      let serviceAccount;
      
      if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      } else {
        serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      result.firebaseInit = 'success - new app created';
    } else {
      result.firebaseInit = 'success - app already exists';
    }

    // Try to access Firestore
    const { getFirestore } = await import('firebase-admin/firestore');
    const db = getFirestore();
    
    // Try a simple read operation
    const testDoc = await db.collection('test').doc('test').get();
    result.firestoreAccess = {
      success: true,
      docExists: testDoc.exists,
    };

  } catch (error) {
    result.firebaseError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined,
    };
  }

  return NextResponse.json(result, { 
    status: result.firebaseError ? 500 : 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}