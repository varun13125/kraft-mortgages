import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin } from '@/lib/db/firestore';

export async function POST(request: NextRequest) {
  const debugInfo: any = {
    step: 'init',
    timestamp: new Date().toISOString(),
  };

  try {
    // Step 1: Check environment variables
    debugInfo.step = 'env_check';
    const hasFirebaseConfig = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    );

    debugInfo.firebaseEnvVars = {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmailPrefix: process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 20) + '...',
      privateKeyPrefix: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) + '...',
    };

    if (!hasFirebaseConfig) {
      debugInfo.error = 'Missing Firebase environment variables';
      return NextResponse.json(debugInfo, { status: 500 });
    }

    // Step 2: Check auth header
    debugInfo.step = 'auth_header_check';
    const authHeader = request.headers.get('authorization');
    debugInfo.hasAuthHeader = !!authHeader;
    debugInfo.authHeaderFormat = authHeader?.startsWith('Bearer ') ? 'valid' : 'invalid';

    if (!authHeader?.startsWith('Bearer ')) {
      debugInfo.error = 'Missing or invalid authorization header';
      return NextResponse.json(debugInfo, { status: 401 });
    }

    // Step 3: Verify Firebase token
    debugInfo.step = 'token_verification';
    const token = authHeader.split('Bearer ')[1];
    debugInfo.tokenLength = token.length;
    
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(token);
      debugInfo.tokenValid = true;
      debugInfo.uid = decodedToken.uid;
      debugInfo.email = decodedToken.email;
    } catch (tokenError) {
      debugInfo.tokenValid = false;
      debugInfo.tokenError = tokenError instanceof Error ? tokenError.message : 'Unknown token error';
      return NextResponse.json(debugInfo, { status: 401 });
    }

    // Step 4: Check admin status
    debugInfo.step = 'admin_check';
    try {
      const userIsAdmin = await isAdmin(decodedToken.uid);
      debugInfo.isAdmin = userIsAdmin;
      
      if (!userIsAdmin) {
        debugInfo.error = 'User is not an admin';
        debugInfo.note = 'Use /api/make-admin to make yourself admin';
        return NextResponse.json(debugInfo, { status: 403 });
      }
    } catch (adminError) {
      debugInfo.adminCheckError = adminError instanceof Error ? adminError.message : 'Unknown admin check error';
      return NextResponse.json(debugInfo, { status: 500 });
    }

    // Step 5: Parse request body
    debugInfo.step = 'body_parsing';
    try {
      const body = await request.json();
      debugInfo.requestBody = body;
      debugInfo.bodyValid = true;
    } catch (bodyError) {
      debugInfo.bodyValid = false;
      debugInfo.bodyError = bodyError instanceof Error ? bodyError.message : 'Unknown body error';
      return NextResponse.json(debugInfo, { status: 400 });
    }

    // If we get here, everything should work
    debugInfo.step = 'success';
    debugInfo.message = 'All checks passed - /api/run should work now';
    debugInfo.allGood = true;

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error) {
    debugInfo.step = 'unexpected_error';
    debugInfo.unexpectedError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    };
    
    console.error('Debug run error:', error);
    return NextResponse.json(debugInfo, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Debug endpoint for /api/run issues',
    usage: 'POST with same auth and body as /api/run',
    note: 'This will show exactly where the error occurs'
  });
}