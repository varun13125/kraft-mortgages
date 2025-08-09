import { NextRequest, NextResponse } from 'next/server';
import { getRun } from '@/lib/pipeline/orchestrator';
import admin from 'firebase-admin';

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    // Verify authentication
    await verifyAuth(request);
    
    const { runId } = params;
    
    if (!runId) {
      return NextResponse.json(
        { error: 'Run ID is required' },
        { status: 400 }
      );
    }

    const run = await getRun(runId);
    
    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(run);

  } catch (error) {
    console.error('Get run error:', error);
    
    if (error instanceof Error && error.message.includes('authorization')) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}