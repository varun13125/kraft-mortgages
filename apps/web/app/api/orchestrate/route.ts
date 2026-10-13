export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stepOrchestrate, createRun } from '@/lib/pipeline/orchestrator';
import { getRecentRuns } from '@/lib/db/firestore';
import { hasServiceSecret, verifyCronRequest } from '@/lib/auth';

const OrchestrateRequestSchema = z.object({
  runId: z.string().max(128).optional(),
});

// A cron-created run started within this window means "already ran today".
const CRON_DEDUPE_WINDOW_MS = 20 * 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    // Verify API key for cron jobs / crew service (x-api-key: CREWAPI_SECRET)
    if (!hasServiceSecret(request)) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parsed = OrchestrateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    const { runId } = parsed.data;

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
        error: 'Internal server error',
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
    // SECURITY: the previous check also accepted any request whose pathname was
    // '/api/orchestrate' (always true), so anyone could trigger paid LLM runs
    // that auto-publish blog posts. See verifyCronRequest() for accepted auth.
    const cron = verifyCronRequest(request, { allowUnverifiedVercelUa: true });
    if (!cron.ok) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Idempotency / abuse cap: at most one cron-created run per ~day, unless an
    // authenticated (secret-bearing) caller explicitly passes ?force=1.
    const force = request.nextUrl.searchParams.get('force') === '1' && cron.via !== 'vercel_cron_ua_unverified';
    if (!force) {
      try {
        const recent = await getRecentRuns(10);
        const lastCron = recent.find(r => r.createdBy === 'system-cron' && r.startedAt instanceof Date);
        if (lastCron && Date.now() - (lastCron.startedAt as Date).getTime() < CRON_DEDUPE_WINDOW_MS) {
          return NextResponse.json({
            success: true,
            skipped: true,
            runId: lastCron.id,
            message: 'A cron run was already started in the last 20 hours',
          });
        }
      } catch (dedupeError) {
        console.warn('Cron dedupe check failed, continuing:', dedupeError instanceof Error ? dedupeError.message : dedupeError);
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

    console.log(`Cron job started run ${runId} (auth: ${cron.via}):`, result);

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
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
