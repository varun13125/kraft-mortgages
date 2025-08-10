import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin, createRun as dbCreateRun } from '@/lib/db/firestore';

export async function POST(request: NextRequest) {
  const debug: any = {
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    // Step 1: Check Firebase config
    debug.steps.push({ step: 'firebase_config', hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON });

    // Step 2: Check auth header
    const authHeader = request.headers.get('authorization');
    debug.steps.push({ step: 'auth_header', hasHeader: !!authHeader, valid: authHeader?.startsWith('Bearer ') });
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ...debug, error: 'Missing Bearer token' }, { status: 401 });
    }

    // Step 3: Verify token
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(token);
      debug.steps.push({ step: 'token_verify', success: true, uid: decodedToken.uid, email: decodedToken.email });
    } catch (e) {
      debug.steps.push({ step: 'token_verify', success: false, error: e instanceof Error ? e.message : 'Unknown' });
      return NextResponse.json({ ...debug, error: 'Token verification failed' }, { status: 401 });
    }

    // Step 4: Check admin status
    try {
      const adminStatus = await isAdmin(decodedToken.uid);
      debug.steps.push({ step: 'admin_check', isAdmin: adminStatus, uid: decodedToken.uid });
      
      if (!adminStatus) {
        return NextResponse.json({ ...debug, error: 'Not an admin' }, { status: 403 });
      }
    } catch (e) {
      debug.steps.push({ step: 'admin_check', error: e instanceof Error ? e.message : 'Unknown' });
      return NextResponse.json({ ...debug, error: 'Admin check failed' }, { status: 500 });
    }

    // Step 5: Parse body
    let body;
    try {
      body = await request.json();
      debug.steps.push({ step: 'body_parse', success: true, body });
    } catch (e) {
      debug.steps.push({ step: 'body_parse', success: false, error: e instanceof Error ? e.message : 'Unknown' });
      return NextResponse.json({ ...debug, error: 'Invalid JSON body' }, { status: 400 });
    }

    // Step 6: Try to create a test run
    try {
      const testSteps = [
        { agent: 'topic-scout', status: 'queued' as const },
        { agent: 'brief', status: 'queued' as const },
        { agent: 'writer', status: 'queued' as const },
        { agent: 'gate', status: 'queued' as const },
        { agent: 'editor', status: 'queued' as const },
        { agent: 'publish', status: 'queued' as const }
      ];

      const runId = await dbCreateRun({
        mode: body.mode || 'auto',
        manualQuery: body.manualQuery,
        targetProvinces: body.targetProvinces || ['BC'],
        steps: testSteps,
        createdBy: decodedToken.uid,
        startedAt: new Date(),
      });

      debug.steps.push({ step: 'run_creation', success: true, runId });
      
      return NextResponse.json({ 
        ...debug, 
        success: true, 
        runId,
        message: 'Test run created successfully' 
      });

    } catch (e) {
      debug.steps.push({ 
        step: 'run_creation', 
        success: false, 
        error: e instanceof Error ? e.message : 'Unknown',
        stack: e instanceof Error ? e.stack : undefined
      });
      return NextResponse.json({ ...debug, error: 'Failed to create run in database' }, { status: 500 });
    }

  } catch (e) {
    debug.unexpectedError = {
      message: e instanceof Error ? e.message : 'Unknown',
      stack: e instanceof Error ? e.stack : undefined
    };
    return NextResponse.json({ ...debug, error: 'Unexpected error' }, { status: 500 });
  }
}