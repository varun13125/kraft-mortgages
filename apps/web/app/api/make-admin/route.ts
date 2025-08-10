import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { db } from '@/lib/db/firestore';

// TEMPORARY ENDPOINT - REMOVE AFTER SETUP
export async function POST(request: NextRequest) {
  try {
    // Get the auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Please login first' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyFirebaseToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;

    // Check if already admin
    const adminDoc = await (await db.collection('admins')).doc(uid).get();
    if (adminDoc.exists) {
      return NextResponse.json({ 
        message: 'You are already an admin!',
        uid,
        email 
      });
    }

    // SECURITY: Only allow specific email (change this to your email)
    const ALLOWED_EMAILS = [
      'varun@kraftmortgages.ca',
      'varun131250@gmail.com', // Add your actual login email here if different
    ];

    // Security check - enable this in production
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      return NextResponse.json({ 
        error: 'This email is not authorized to become admin',
        yourEmail: email,
        note: 'If this is your email, add it to ALLOWED_EMAILS in the code'
      }, { status: 403 });
    }

    // Make the user an admin
    await (await db.collection('admins')).doc(uid).set({
      email: email || 'unknown',
      role: 'admin',
      createdAt: new Date().toISOString(),
      createdBy: 'make-admin-endpoint'
    });

    return NextResponse.json({ 
      success: true,
      message: 'You are now an admin!',
      uid,
      email,
      note: 'IMPORTANT: Remove the /api/make-admin endpoint after this!'
    });

  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json({ 
      error: 'Failed to make admin',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'This endpoint requires POST with authentication',
    instructions: [
      '1. Login to the dashboard first',
      '2. Open browser console',
      '3. Run this code:',
      `
fetch('/api/make-admin', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + await firebase.auth().currentUser.getIdToken()
  }
}).then(r => r.json()).then(console.log)
      `
    ]
  });
}