import { updateRun } from '@/lib/db/firestore';

export async function log(runId: string, message: string): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(`[${runId}] ${timestamp}: ${message}`);
  
  // Optionally store logs in Firestore for debugging
  try {
    const run = await updateRun(runId, {
      [`logs.${Date.now()}`]: {
        timestamp,
        message,
      },
    });
  } catch (error) {
    // Don't fail the pipeline if logging fails
    console.warn('Failed to store log:', error);
  }
}