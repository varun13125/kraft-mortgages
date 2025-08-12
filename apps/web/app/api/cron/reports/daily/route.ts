import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST() {
  // compute yesterday KPIs
  const today = new Date();
  const y = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-1));
  const yEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  let leads: any[] = [];
  if (process.env.DATABASE_URL) {
    leads = await prisma.lead.findMany({ where: { createdAt: { gte: y, lt: yEnd } } });
  } else {
    const db = firestore();
    const snap = await (await db.collection("leads")).where("createdAt", ">=", y).where("createdAt", "<", yEnd).get();
    leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
  }
  const leadsNew = leads.length;
  const leadsQualified = leads.filter((l: any) => l.status === 'QUALIFIED').length;
  const conversionRate = leadsNew ? (leadsQualified / leadsNew) : 0;
  if (process.env.DATABASE_URL) {
    await prisma.kpiDaily.upsert({
      where: { date: y },
      update: { leadsNew, leadsQualified, conversionRate },
      create: { date: y, leadsNew, leadsQualified, conversionRate }
    });
  } else {
    const db = firestore();
    const ref = (await db.collection("kpiDaily")).doc(y.toISOString().slice(0,10));
    await ref.set({ date: y, leadsNew, leadsQualified, conversionRate, createdAt: new Date() }, { merge: true });
  }
  return Response.json({ ok: true, date: y.toISOString().slice(0,10), leadsNew, leadsQualified, conversionRate });
}
