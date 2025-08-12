import { prisma } from "@/lib/db";
import { runNurtureSequence } from "@/lib/automations";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST() {
  let leads: any[] = [];
  if (process.env.DATABASE_URL) {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }) as any[];
  } else {
    const db = firestore();
    const snap = await (await db.collection("leads")).orderBy("createdAt","desc").limit(10).get();
    leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
  }
  for (const l of leads) {
    await runNurtureSequence({ id: l.id, score: l.score, email: (l.details as any)?.email, phone: (l.details as any)?.phone });
  }
  return Response.json({ processed: leads.length });
}
