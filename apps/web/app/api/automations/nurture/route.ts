import { NextRequest } from "next/server";
import { prisma, isPrismaEnabled } from "@/lib/db";
import { runNurtureSequence } from "@/lib/automations";
import { firestore } from "@/lib/firebaseAdmin";
import { requireAdmin, verifyCronRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // SECURITY: previously unauthenticated - anyone could make the server read the
  // latest leads (and write their emails/phones to the logs via the console transport).
  if (!verifyCronRequest(req).ok) {
    const admin = await requireAdmin(req);
    if (!admin.ok) return Response.json({ error: admin.error }, { status: admin.status });
  }

  try {
    let leads: any[] = [];
    if (isPrismaEnabled()) {
      leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }) as any[];
    } else {
      const db = firestore();
      const snap = await db.collection("leads").orderBy("createdAt","desc").limit(10).get();
      leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
    }
    // NOTE: runNurtureSequence uses the console transport (no email/SMS provider is
    // wired up yet - Phase 7). Nothing is actually sent to leads.
    for (const l of leads) {
      await runNurtureSequence({ id: l.id, score: l.score, email: (l.details as any)?.email, phone: (l.details as any)?.phone });
    }
    return Response.json({ processed: leads.length, delivered: false, transport: "console" });
  } catch (error) {
    console.error("[automations/nurture] failed:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Nurture run failed" }, { status: 500 });
  }
}
