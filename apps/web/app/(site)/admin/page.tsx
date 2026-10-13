import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
export const dynamic = "force-dynamic";

// Firestore returns Timestamp objects; new Date(Timestamp) is "Invalid Date".
const toDate = (v: any) => (v?.toDate ? v.toDate() : new Date(v));

// Access is gated by HTTP Basic Auth in middleware.ts (ADMIN_BASIC_AUTH_USER / _PASSWORD).
export default async function Admin() {
  let leads: any[] = [];
  let loadError: string | null = null;
  try {
    if (process.env.DATABASE_URL) {
      leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }) as any[];
    } else {
      const db = firestore();
      const snap = await db.collection("leads").orderBy("createdAt","desc").limit(100).get();
      leads = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
    }
  } catch (err) {
    console.error("[admin] failed to load leads:", err instanceof Error ? err.message : err);
    loadError = "Could not load leads (database unavailable or not configured).";
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin — Leads</h2>
      {loadError && <p className="text-sm text-red-500">{loadError}</p>}
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th>ID</th><th>Province</th><th>Status</th><th>Score</th><th>Intent</th><th>Created</th></tr></thead>
        <tbody>
          {leads.map((l: any)=> (
            <tr key={l.id} className="border-b">
              <td className="py-2">{l.id.slice(0,8)}</td>
              <td>{l.province}</td>
              <td>{l.status}</td>
              <td>{l.score}</td>
              <td className="truncate max-w-[240px]">{l.intent}</td>
              <td>{toDate(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
