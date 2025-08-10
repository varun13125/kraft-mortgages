import { NextResponse } from 'next/server';
import { db } from '@/lib/db/firestore';

export async function GET() {
  try {
    // Check environment variables
    const hasFirebaseConfig = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (!hasFirebaseConfig) {
      return NextResponse.json({
        ok: false,
        error: 'Firebase Admin SDK not configured',
        missing: {
          projectId: !process.env.FIREBASE_PROJECT_ID,
          clientEmail: !process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: !process.env.FIREBASE_PRIVATE_KEY,
        }
      }, { status: 500 });
    }

    // Try to read from Firestore
    const testDoc = await (await db.collection('test')).doc('test').get();
    
    return NextResponse.json({
      ok: true,
      firebaseConfigured: true,
      firestoreConnected: true,
      testDocExists: testDoc.exists,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}