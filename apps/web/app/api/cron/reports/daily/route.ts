import { NextRequest } from "next/server";
import { prisma, isPrismaEnabled } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { requireAdmin, verifyCronRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function authorize(req: NextRequest): Promise<Response | null> {
  // SECURITY: previously unauthenticated - anyone could trigger lead scans / KPI writes.
  if (verifyCronRequest(req).ok) return null;
  const admin = await requireAdmin(req);
  return admin.ok ? null : Response.json({ error: admin.error }, { status: admin.status });
}

async function handler(req: NextRequest) {
  const denied = await authorize(req);
  if (denied) return denied;

  try {
    // compute yesterday KPIs
    const today = new Date();
    const y = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-1));
    const yEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    let leads: any[] = [];
    if (isPrismaEnabled()) {
      leads = await prisma.lead.findMany({ where: { createdAt: { gte: y, lt: yEnd } } });
    } else {
      const db = firestore();
      const snap = await db.collection("leads").where("createdAt", ">=", y).where("createdAt", "<", yEnd).get();
      leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
    }
    const leadsNew = leads.length;
    const leadsQualified = leads.filter((l: any) => l.status === 'QUALIFIED').length;
    const conversionRate = leadsNew ? (leadsQualified / leadsNew) : 0;
    if (isPrismaEnabled()) {
      await prisma.kpiDaily.upsert({
        where: { date: y },
        update: { leadsNew, leadsQualified, conversionRate },
        create: { date: y, leadsNew, leadsQualified, conversionRate }
      });
    } else {
      const db = firestore();
      const ref = db.collection("kpiDaily").doc(y.toISOString().slice(0,10));
      await ref.set({ date: y, leadsNew, leadsQualified, conversionRate, createdAt: new Date() }, { merge: true });
    }
    return Response.json({ ok: true, date: y.toISOString().slice(0,10), leadsNew, leadsQualified, conversionRate });
  } catch (error) {
    console.error("[cron/reports/daily] failed:", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, error: "KPI report failed" }, { status: 500 });
  }
}

export const POST = handler;
// Vercel Cron invokes GET
export const GET = handler;
