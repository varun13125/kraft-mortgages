import { prisma } from "@/lib/db";

export default async function AdminRates() {
  const rows = await prisma.rateSnapshot.findMany({ orderBy: { capturedAt: 'desc' }, take: 200 });
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
              <td>{r.rateAPR.toFixed(2)}</td>
              <td>{r.province ?? "-"}</td>
              <td>{new Date(r.capturedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
