export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/auth';
import { isAdmin, getRun } from '@/lib/db/firestore';
import { stepOrchestrate } from '@/lib/pipeline/orchestrator';

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing auth' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await verifyFirebaseToken(token);
    const userIsAdmin = await isAdmin(decodedToken.uid);
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Admin required' }, { status: 403 });
    }

    // Get runId from body
    const { runId } = await request.json();
    if (!runId) {
      return NextResponse.json({ error: 'runId required' }, { status: 400 });
    }

    console.log(`Starting full orchestration for run: ${runId}`);

    // Process all steps in sequence
    let stepCount = 0;
    const maxSteps = 10; // Safety limit
    
    while (stepCount < maxSteps) {
      console.log(`Orchestration step ${stepCount + 1} for run ${runId}`);
      
      const result = await stepOrchestrate(runId);
      console.log(`Step ${stepCount + 1} result:`, result);
      
      if (result.done) {
        console.log(`Run ${runId} completed after ${stepCount + 1} steps`);
        break;
      }
      
      if (result.error) {
        console.error(`Error in step ${stepCount + 1}:`, result.error);
        return NextResponse.json({ 
          error: `Failed at step ${stepCount + 1}: ${result.error}`,
          stepCount: stepCount + 1
        }, { status: 500 });
      }
      
      stepCount++;
      
      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const finalRun = await getRun(runId);
    
    return NextResponse.json({ 
      success: true,
      runId,
      stepsProcessed: stepCount,
      finalStatus: finalRun?.steps
    });

  } catch (error) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ 
      error: 'Orchestration failed',
      details: (error as Error).message 
    }, { status: 500 });
  }
}