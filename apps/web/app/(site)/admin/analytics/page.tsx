import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
export const dynamic = "force-dynamic";
import { TimeSeries } from "@/components/charts/TimeSeries";
import { movingAverage, linearProjection } from "@/lib/forecast";

function toDateStr(d: Date) {
  return new Date(d).toISOString().slice(0,10);
}

export default async function Analytics() {
  let leads: Array<{ createdAt: Date; status: string }> = [] as any;
  if (process.env.DATABASE_URL) {
    leads = await prisma.lead.findMany({ select: { createdAt: true, status: true }, orderBy: { createdAt: 'asc' } }) as any;
  } else {
    const db = firestore();
    const snap = await db.collection("leads").orderBy("createdAt","asc").get();
    leads = snap.docs.map(d=> ({ createdAt: (d.data() as any).createdAt?.toDate?.() ?? new Date((d.data() as any).createdAt), status: (d.data() as any).status || "NEW" }));
  }
  const byDay = new Map<string, { new: number; qualified: number }>();
  for (const l of leads) {
    const key = toDateStr(l.createdAt);
    if (!byDay.has(key)) byDay.set(key, { new:0, qualified:0 });
    const row = byDay.get(key)!;
    row.new += 1;
    if (l.status === 'QUALIFIED') row.qualified += 1;
  }
  const series = Array.from(byDay.entries()).map(([date, v])=> ({ date, value: v.new, qualified: v.qualified }));
  const conversions = series.map(r => r.qualified / Math.max(1, r.value));
  const ma = movingAverage(series.map(s=>s.value), 7);
  const proj = linearProjection(ma, 14).map((v,i)=> ({ date: `+${i+1}`, value: v }));

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Analytics & Forecast</h2>
      <div>
        <h3 className="font-medium mb-2">Leads per day</h3>
        <TimeSeries data={series} xKey="date" yKey="value" label="Leads" />
      </div>
      <div>
        <h3 className="font-medium mb-2">7‑day MA (projection next 14 days)</h3>
        <TimeSeries data={proj} xKey="date" yKey="value" label="Projected" />
      </div>
      <div className="text-sm text-muted-foreground">Conversion (historical avg): {(conversions.reduce((a,b)=>a+b,0)/Math.max(1,conversions.length)*100).toFixed(1)}%</div>
    </div>
  );
}
