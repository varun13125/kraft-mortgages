import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
export const dynamic = "force-dynamic";

// Firestore returns Timestamp objects; new Date(Timestamp) is "Invalid Date".
const toDate = (v: any) => (v?.toDate ? v.toDate() : new Date(v));

// Access is gated by HTTP Basic Auth in middleware.ts (ADMIN_BASIC_AUTH_USER / _PASSWORD).
export default async function AdminRates() {
  let rows: any[] = [];
  try {
    if (process.env.DATABASE_URL) {
      rows = await prisma.rateSnapshot.findMany({ orderBy: { capturedAt: 'desc' }, take: 200 }) as any[];
    } else {
      const db = firestore();
      const snap = await db.collection("rateSnapshots").orderBy("capturedAt","desc").limit(200).get();
      rows = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
    }
  } catch (err) {
    console.error("[admin/rates] failed to load snapshots:", err instanceof Error ? err.message : err);
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin — Rate Snapshots</h2>
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th>Lender</th><th>Term</th><th>APR %</th><th>Province</th><th>Captured</th></tr></thead>
        <tbody>
          {rows.map((r: any) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.lender}</td>
              <td>{r.termMonths} mo</td>
              <td>{Number(r.rateAPR ?? 0).toFixed(2)}</td>
              <td>{r.province ?? "-"}</td>
              <td>{toDate(r.capturedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
