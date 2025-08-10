export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes max for Edge functions

import { NextRequest, NextResponse } from 'next/server';
import { stepOrchestrate } from '@/lib/pipeline/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { runId } = await request.json();
    
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
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        runId: request.json ? (await request.json()).runId : null,
      },
      { status: 500 }
    );
  }
}