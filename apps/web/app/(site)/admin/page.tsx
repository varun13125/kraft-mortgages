import { prisma } from "@/lib/db";

export default async function Admin() {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin — Leads</h2>
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
              <td>{new Date(l.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
