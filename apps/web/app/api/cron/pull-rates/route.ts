import { prisma } from "@/lib/db";

export async function POST() {
  const url = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
  const r = await fetch(`${url}/lenders/aggregate`, { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ province: null }) });
  const { rows } = await r.json();
  const data = rows.filter((x:any)=> !x.error).map((x:any)=> ({
    lender: String(x.lender), termMonths: Number(x.termMonths||0), rateAPR: Number(x.rateAPR||0), province: x.province || null
  }));
  if (data.length) await prisma.rateSnapshot.createMany({ data, skipDuplicates: false });
  return Response.json({ inserted: data.length });
}
