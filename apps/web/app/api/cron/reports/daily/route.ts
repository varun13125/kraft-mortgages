import { prisma } from "@/lib/db";

export async function POST() {
  // compute yesterday KPIs
  const today = new Date();
  const y = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-1));
  const yEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const leads = await prisma.lead.findMany({ where: { createdAt: { gte: y, lt: yEnd } } });
  const leadsNew = leads.length;
  const leadsQualified = leads.filter(l=>l.status === 'QUALIFIED').length;
  const conversionRate = leadsNew ? (leadsQualified / leadsNew) : 0;
  await prisma.kpiDaily.upsert({
    where: { date: y },
    update: { leadsNew, leadsQualified, conversionRate },
    create: { date: y, leadsNew, leadsQualified, conversionRate }
  });
  return Response.json({ ok: true, date: y.toISOString().slice(0,10), leadsNew, leadsQualified, conversionRate });
}
