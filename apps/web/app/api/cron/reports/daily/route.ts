import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST() {
  // compute yesterday KPIs
  const today = new Date();
  const y = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-1));
  const yEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  let leads: any[] = [];
  if ((prisma as any) instanceof PrismaClient) {
    leads = await (prisma as PrismaClient).lead.findMany({ where: { createdAt: { gte: y, lt: yEnd } } });
  } else {
    const db = firestore();
    const snap = await db.collection("leads").where("createdAt", ">=", y).where("createdAt", "<", yEnd).get();
    leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
  }
  const leadsNew = leads.length;
  const leadsQualified = leads.filter((l: any) => l.status === 'QUALIFIED').length;
  const conversionRate = leadsNew ? (leadsQualified / leadsNew) : 0;
  if ((prisma as any) instanceof PrismaClient) {
    await (prisma as PrismaClient).kpiDaily.upsert({
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
}
