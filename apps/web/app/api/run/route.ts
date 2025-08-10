import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin } from '@/lib/db/firestore';
import { createRun } from '@/lib/pipeline/orchestrator';

const RunRequestSchema = z.object({
  mode: z.enum(['auto', 'manual-topic', 'manual-idea']),
  manualQuery: z.string().optional(),
  targetProvinces: z.array(z.string()).default(['BC', 'AB', 'ON']),
});

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decodedToken = await verifyFirebaseToken(token);
  
  const userIsAdmin = await isAdmin(decodedToken.uid);
  if (!userIsAdmin) {
    throw new Error('Admin access required');
  }

  return decodedToken;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase environment variables are configured
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const hasIndividualVars = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
    
    if (!hasServiceAccount && !hasIndividualVars) {
      console.error('Missing Firebase Admin SDK environment variables');
      return NextResponse.json(
        { error: 'Server configuration error - Firebase not configured' },
        { status: 500 }
      );
    }

    // Verify authentication and admin status
    const user = await verifyAuth(request);
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = RunRequestSchema.parse(body);
    const { mode, manualQuery, targetProvinces } = validatedData;

    // Validate manual query requirement
    if ((mode === 'manual-topic' || mode === 'manual-idea') && !manualQuery?.trim()) {
      return NextResponse.json(
        { error: 'Manual query is required for manual modes' },
        { status: 400 }
      );
    }

    // Create new run
    const runId = await createRun(mode, manualQuery || undefined, targetProvinces, user.uid);

    if (!runId) {
      throw new Error('Failed to create run - no ID returned');
    }

    return NextResponse.json({ runId, message: 'Run created successfully' });

  } catch (error) {
    console.error('Run creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message.includes('authorization') || error.message.includes('Admin')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      
      // Log the full error for debugging
      console.error('Full error:', error.message, error.stack);
    }

    return NextResponse.json(
      { error: 'Internal server error - check server logs' },
      { status: 500 }
    );
  }
}