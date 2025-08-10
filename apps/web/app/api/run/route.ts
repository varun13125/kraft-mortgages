export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin, createRun as dbCreateRun } from '@/lib/db/firestore';

const RunRequestSchema = z.object({
  mode: z.enum(['auto', 'manual-topic', 'manual-idea']),
  manualQuery: z.string().optional(),
  targetProvinces: z.array(z.enum(['BC', 'AB', 'ON'])).default(['BC', 'AB', 'ON'])
});

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify auth header exists
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('Missing or invalid auth header:', authHeader?.substring(0, 20));
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    // Step 2: Verify Firebase token
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(token);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Step 3: Check admin status
    let userIsAdmin;
    try {
      userIsAdmin = await isAdmin(decodedToken.uid);
    } catch (adminError) {
      console.error('Admin check failed:', adminError);
      return NextResponse.json(
        { error: 'Failed to verify admin status' },
        { status: 500 }
      );
    }

    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Step 4: Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    let validatedData;
    try {
      validatedData = RunRequestSchema.parse(body);
    } catch (zodError) {
      if (zodError instanceof z.ZodError) {
        console.log('Validation error:', zodError.errors);
        return NextResponse.json(
          { error: 'Invalid request data', details: zodError.errors },
          { status: 400 }
        );
      }
      throw zodError;
    }

    const { mode, manualQuery, targetProvinces } = validatedData;

    // Step 5: Validate manual query requirement
    if ((mode === 'manual-topic' || mode === 'manual-idea') && !manualQuery?.trim()) {
      return NextResponse.json(
        { error: 'Manual query is required for manual modes' },
        { status: 400 }
      );
    }

    // Step 6: Create run in database
    let runId;
    try {
      console.log('Step 6: Starting database creation...');
      
      // Create run with proper structure
      const steps = ['topic-scout', 'brief', 'writer', 'gate', 'editor', 'publish'].map(agent => ({
        agent,
        status: 'queued' as const
      }));
      console.log('Created steps array:', steps);

      // Prepare data for Firestore (no undefined values)
      const runData: any = {
        mode,
        targetProvinces,
        steps,
        createdBy: decodedToken.uid
      };
      
      // Only add manualQuery if it has a value
      if (manualQuery && manualQuery.trim()) {
        runData.manualQuery = manualQuery;
      }
      
      console.log('Prepared run data:', runData);
      console.log('About to call dbCreateRun...');

      // Add timeout for database operation
      const dbTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database operation timeout after 25 seconds')), 25000)
      );
      
      const dbPromise = dbCreateRun(runData);
      runId = await Promise.race([dbPromise, dbTimeout]);

      console.log('Run created successfully with ID:', runId);
    } catch (dbError) {
      console.error('Database error creating run:', dbError);
      console.error('Stack:', (dbError as Error).stack);
      return NextResponse.json(
        { error: 'Failed to create run in database', details: (dbError as Error).message },
        { status: 500 }
      );
    }

    if (!runId) {
      console.error('No run ID returned from createRun');
      return NextResponse.json(
        { error: 'Failed to create run - no ID returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      runId, 
      message: 'Run created successfully' 
    });

  } catch (unexpectedError) {
    // Catch-all for unexpected errors
    console.error('Unexpected error in POST /api/run:');
    console.error('Message:', (unexpectedError as Error).message);
    console.error('Stack:', (unexpectedError as Error).stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: (unexpectedError as Error).message 
      },
      { status: 500 }
    );
  }
}