import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin, adminsCol } from '@/lib/db/firestore';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Missing authorization header',
        isAdmin: false 
      }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(token);
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid token',
        details: error instanceof Error ? error.message : 'Unknown error',
        isAdmin: false 
      }, { status: 401 });
    }
    
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    
    // Check admin status
    const adminStatus = await isAdmin(uid);
    
    // Also fetch the admin document directly for debugging
    const adminsCollection = await adminsCol();
    const adminDoc = await adminsCollection.doc(uid).get();
    
    const adminData = adminDoc.exists ? adminDoc.data() : null;
    
    return NextResponse.json({ 
      isAdmin: adminStatus,
      uid,
      email,
      adminDocExists: adminDoc.exists,
      adminData,
      debug: {
        tokenUid: decodedToken.uid,
        tokenEmail: decodedToken.email,
        decodedToken: {
          uid: decodedToken.uid,
          email: decodedToken.email,
          email_verified: decodedToken.email_verified
        }
      }
    });

  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json({ 
      error: 'Failed to check admin status',
      details: error instanceof Error ? error.message : 'Unknown error',
      isAdmin: false
    }, { status: 500 });
  }
}