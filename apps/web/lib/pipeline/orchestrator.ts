import { getRun, updateRun, updateRunStep, createRun as dbCreateRun, encodeEmbeddings } from '@/lib/db/firestore';
import type { Run, Step } from '@/lib/db/firestore';
import { scoutStage } from './stages/scout';
import { briefStage } from './stages/brief';
import { writerStage } from './stages/writer';
import { gateStage } from './stages/gate';
import { editorStage } from './stages/editor';
import { publishStage } from './stages/publish';
import { log } from '@/lib/runlog';

const STAGES = ['topic-scout', 'brief', 'writer', 'gate', 'editor', 'publish'] as const;
type StageName = typeof STAGES[number];

// Run field each stage's output is stored under. Downstream stages and the
// /api/runs/[runId]/stream endpoint read these names (run.scout, run.draft,
// run.final, ...). Previously the key was derived as stageName.replace('-', '')
// ('topicscout', 'writer', 'editor', 'publish'), so writer/gate/editor/publish
// could never find their inputs (brief stage needs run.scout, so every run
// failed at stage 2).
const STAGE_OUTPUT_FIELD: Record<StageName, 'scout' | 'brief' | 'draft' | 'gate' | 'final' | 'published'> = {
  'topic-scout': 'scout',
  brief: 'brief',
  writer: 'draft',
  gate: 'gate',
  editor: 'final',
  publish: 'published',
};

interface StageResult {
  success: boolean;
  data?: any;
  enqueue?: string[];
  error?: string;
}

export async function createRun(
  mode: 'auto' | 'manual-topic' | 'manual-idea',
  manualQuery: string | undefined,
  targetProvinces: string[],
  createdBy: string
): Promise<string> {
  const steps: Step[] = STAGES.map(stage => ({
    agent: stage,
    status: 'queued' as const,
  }));

  return await dbCreateRun({
    mode,
    manualQuery,
    targetProvinces,
    steps,
    createdBy,
    startedAt: new Date(),
  });
}

export async function stepOrchestrate(runId: string): Promise<{ done: boolean; step?: string; ok?: boolean; error?: string }> {
  const run = await getRun(runId);
  if (!run) {
    return { done: true, error: 'Run not found' };
  }

  // Find next queued step
  const nextStepIndex = run.steps.findIndex(step => step.status === 'queued');
  if (nextStepIndex === -1) {
    return { done: true }; // All steps completed
  }

  const step = run.steps[nextStepIndex];
  const stageName = step.agent as StageName;

  // Mark step as running
  await updateRunStep(runId, nextStepIndex, {
    status: 'running',
    startedAt: new Date(),
  });

  log(runId, `Starting stage: ${stageName}`);

  try {
    let result: StageResult;

    // Execute the appropriate stage
    switch (stageName) {
      case 'topic-scout':
        result = await scoutStage(run);
        break;
      case 'brief':
        result = await briefStage(run);
        break;
      case 'writer':
        result = await writerStage(run);
        break;
      case 'gate':
        result = await gateStage(run);
        break;
      case 'editor':
        result = await editorStage(run);
        break;
      case 'publish':
        result = await publishStage(run);
        break;
      default:
        throw new Error(`Unknown stage: ${stageName}`);
    }

    if (result.success) {
      // Mark step as completed
      await updateRunStep(runId, nextStepIndex, {
        status: 'ok',
        finishedAt: new Date(),
      });

      // Save stage data to run
      if (result.data) {
        const field = STAGE_OUTPUT_FIELD[stageName];
        let payload = result.data;
        // Gate output carries number[][] embeddings - Firestore rejects nested arrays
        if (payload && Array.isArray(payload.embeddings)) {
          payload = { ...payload, embeddings: encodeEmbeddings(payload.embeddings) };
        }
        await updateRun(runId, { [field]: payload } as Partial<Run>);
      }

      // Handle enqueue (for gate revisions)
      if (result.enqueue && result.enqueue.length > 0) {
        const updatedRun = await getRun(runId);
        if (updatedRun) {
          const newSteps = [...updatedRun.steps];
          
          // Insert enqueued steps after current step
          result.enqueue.forEach((enqueuedStage, index) => {
            newSteps.splice(nextStepIndex + 1 + index, 0, {
              agent: enqueuedStage,
              status: 'queued' as const,
            });
          });

          // updateRun strips undefined values (Firestore rejects them)
          await updateRun(runId, { steps: newSteps });
        }
      }

      log(runId, `Completed stage: ${stageName}`);
      return { done: false, step: stageName, ok: true };

    } else {
      // Mark step as failed
      await updateRunStep(runId, nextStepIndex, {
        status: 'error',
        finishedAt: new Date(),
        error: result.error,
      });

      log(runId, `Failed stage: ${stageName} - ${result.error}`);
      return { done: true, step: stageName, ok: false, error: result.error };
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Mark step as failed
    await updateRunStep(runId, nextStepIndex, {
      status: 'error',
      finishedAt: new Date(),
      error: errorMessage,
    });

    log(runId, `Error in stage: ${stageName} - ${errorMessage}`);
    return { done: true, step: stageName, ok: false, error: errorMessage };
  }
}

export { getRun } from '@/lib/db/firestore';