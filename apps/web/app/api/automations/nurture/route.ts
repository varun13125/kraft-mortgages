import { prisma } from "@/lib/db";
import { runNurtureSequence } from "@/lib/automations";

export async function POST() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
  for (const l of leads) {
    await runNurtureSequence({ id: l.id, score: l.score, email: (l.details as any)?.email, phone: (l.details as any)?.phone });
  }
  return Response.json({ processed: leads.length });
}
