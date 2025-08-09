import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import admin from 'firebase-admin';
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
  const decodedToken = await admin.auth().verifyIdToken(token);
  
  const userIsAdmin = await isAdmin(decodedToken.uid);
  if (!userIsAdmin) {
    throw new Error('Admin access required');
  }

  return decodedToken;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin status
    const user = await verifyAuth(request);
    
    // Parse and validate request body
    const body = await request.json();
    const { mode, manualQuery, targetProvinces } = RunRequestSchema.parse(body);

    // Validate manual query requirement
    if ((mode === 'manual-topic' || mode === 'manual-idea') && !manualQuery?.trim()) {
      return NextResponse.json(
        { error: 'Manual query is required for manual modes' },
        { status: 400 }
      );
    }

    // Create new run
    const runId = await createRun(mode, manualQuery, targetProvinces, user.uid);

    return NextResponse.json({ runId });

  } catch (error) {
    console.error('Run creation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('authorization') || error.message.includes('Admin')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}