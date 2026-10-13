export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getRun } from '@/lib/db/firestore';
import { getBearerToken, requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    // Verify authentication (admin only). EventSource cannot send headers, so the
    // dashboard passes the Firebase ID token as ?token= (short-lived, 1h).
    const token = getBearerToken(request) || new URL(request.url).searchParams.get('token');
    const adminCheck = await requireAdmin(request, token);
    if (!adminCheck.ok) {
      return new Response(adminCheck.error, { status: adminCheck.status });
    }
    
    const { runId } = params;
    
    if (!runId) {
      return new Response('Run ID is required', { status: 400 });
    }

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Send initial connection confirmation
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'connected', runId })}\n\n`)
        );

        // Poll for run updates
        const pollInterval = setInterval(async () => {
          try {
            const run = await getRun(runId);
            
            if (run) {
              const message = {
                type: 'run_update',
                run: {
                  id: run.id,
                  mode: run.mode,
                  steps: run.steps,
                  startedAt: run.startedAt,
                  scout: run.scout,
                  brief: run.brief,
                  draft: run.draft,
                  gate: run.gate,
                  final: run.final,
                  published: run.published
                }
              };
              
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
              );

              // Check if run is complete
              const allStepsComplete = run.steps.every(step => 
                step.status === 'ok' || step.status === 'error'
              );

              if (allStepsComplete) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`)
                );
                clearInterval(pollInterval);
                controller.close();
              }
            }
          } catch (error) {
            console.error('SSE poll error:', error);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Poll failed' })}\n\n`)
            );
          }
        }, 2000); // Poll every 2 seconds

        // Clean up on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval);
          controller.close();
        });

        // Auto-close after 10 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          controller.close();
        }, 10 * 60 * 1000);
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        // (Removed wildcard CORS: the dashboard is same-origin.)
      },
    });

  } catch (error) {
    console.error('SSE stream error:', error);

    return new Response('Internal server error', { status: 500 });
  }
}