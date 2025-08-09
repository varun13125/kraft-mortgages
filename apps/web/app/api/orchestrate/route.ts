import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stepOrchestrate, createRun } from '@/lib/pipeline/orchestrator';

const OrchestrateRequestSchema = z.object({
  runId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify API key for cron jobs
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.CREWAPI_SECRET;
    
    if (!apiKey || !expectedKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { runId } = OrchestrateRequestSchema.parse(body);

    let targetRunId = runId;

    // If no runId provided, create a new auto run (for cron)
    if (!targetRunId) {
      targetRunId = await createRun(
        'auto',
        undefined,
        ['BC', 'AB', 'ON'],
        'system-cron'
      );
      console.log(`Created new auto run: ${targetRunId}`);
    }

    // Execute one orchestration step
    const result = await stepOrchestrate(targetRunId);

    return NextResponse.json({
      runId: targetRunId,
      ...result
    });

  } catch (error) {
    console.error('Orchestrate error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        runId: null,
        done: true,
        ok: false
      },
      { status: 500 }
    );
  }
}

// Handle cron job GET requests (Vercel sends GET for cron)
export async function GET(request: NextRequest) {
  try {
    // Verify this is from Vercel cron
    const cronSecret = request.headers.get('authorization');
    const expectedSecret = `Bearer ${process.env.CREWAPI_SECRET}`;
    
    if (!cronSecret || cronSecret !== expectedSecret) {
      // Allow cron without auth header (Vercel cron behavior)
      const isVercelCron = request.headers.get('user-agent')?.includes('vercel') ||
                           request.nextUrl.pathname === '/api/orchestrate';
      
      if (!isVercelCron) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Create and start a new auto run
    const runId = await createRun(
      'auto',
      undefined,
      ['BC', 'AB', 'ON'],
      'system-cron'
    );

    // Execute first step
    const result = await stepOrchestrate(runId);

    console.log(`Cron job started run ${runId}:`, result);

    return NextResponse.json({
      success: true,
      runId,
      message: 'Daily content generation started',
      ...result
    });

  } catch (error) {
    console.error('Cron orchestrate error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}