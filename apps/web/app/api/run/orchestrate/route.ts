export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

import { NextRequest, NextResponse } from 'next/server';
import { stepOrchestrate } from '@/lib/pipeline/orchestrator';
import { hasServiceSecret, requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // SECURITY: this endpoint runs every pipeline stage (paid LLM calls + publishing
  // to the live blog). It was previously unauthenticated. /api/run now forwards
  // the admin's Firebase ID token; the crew service may use x-api-key: CREWAPI_SECRET.
  if (!hasServiceSecret(request)) {
    const adminCheck = await requireAdmin(request);
    if (!adminCheck.ok) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }
  }

  let runId: string | undefined;
  try {
    const body = await request.json().catch(() => ({}));
    runId = typeof body?.runId === 'string' ? body.runId.slice(0, 128) : undefined;

    if (!runId) {
      return NextResponse.json(
        { error: 'Run ID is required' },
        { status: 400 }
      );
    }

    console.log(`Starting orchestration for run: ${runId}`);

    // Process all steps in a loop
    let stepCount = 0;
    const maxSteps = 10;
    let lastResult: any = null;

    while (stepCount < maxSteps) {
      console.log(`Processing step ${stepCount + 1} for run ${runId}`);

      const result = await stepOrchestrate(runId);
      lastResult = result;
      console.log(`Step ${stepCount + 1} result:`, result);

      if (result.done) {
        console.log(`Run ${runId} completed after ${stepCount + 1} steps`);
        break;
      }

      if (result.error) {
        console.error(`Error in step ${stepCount + 1}:`, result.error);
        break;
      }

      stepCount++;

      // Small delay between steps
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Orchestration finished for run ${runId} after ${stepCount} steps`);

    return NextResponse.json({
      runId,
      stepsProcessed: stepCount,
      completed: lastResult?.done || false,
      error: lastResult?.error,
    });

  } catch (error) {
    console.error('Orchestration error:', error);

    // (The old handler re-read the already-consumed body here, which threw again.)
    return NextResponse.json(
      {
        error: 'Internal server error',
        runId: runId ?? null,
      },
      { status: 500 }
    );
  }
}
