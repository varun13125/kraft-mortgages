import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken, getBearerToken } from '@/lib/auth';
import { isAdmin } from '@/lib/db/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({
        error: 'Missing authorization header',
        isAdmin: false
      }, { status: 401 });
    }

    // Verify token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(token);
    } catch {
      return NextResponse.json({
        error: 'Invalid token',
        isAdmin: false
      }, { status: 401 });
    }

    // Check admin status.
    // SECURITY: this endpoint previously returned every document in the `admins`
    // collection (other admins' UIDs/emails) plus token internals to ANY signed-in
    // Firebase user. It now only reports on the caller.
    const adminStatus = await isAdmin(decodedToken.uid);

    return NextResponse.json({
      isAdmin: adminStatus,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

  } catch (error) {
    console.error('Check admin error:', error instanceof Error ? error.message : error);
    return NextResponse.json({
      error: 'Failed to check admin status',
      isAdmin: false
    }, { status: 500 });
  }
}
