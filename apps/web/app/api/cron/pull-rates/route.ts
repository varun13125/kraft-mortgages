import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST() {
  const url = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
  const r = await fetch(`${url}/lenders/aggregate`, { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ province: null }) });
  const { rows } = await r.json();
  const data = rows.filter((x:any)=> !x.error).map((x:any)=> ({
    lender: String(x.lender), termMonths: Number(x.termMonths||0), rateAPR: Number(x.rateAPR||0), province: x.province || null
  }));
  if (!data.length) return Response.json({ inserted: 0 });
  if ((prisma as any) instanceof PrismaClient) {
    await (prisma as PrismaClient).rateSnapshot.createMany({ data, skipDuplicates: false });
    return Response.json({ inserted: data.length });
  }
  const db = firestore();
  const batch = db.batch();
  for (const row of data) {
    const ref = (await db.collection("rateSnapshots")).doc();
    batch.set(ref, { ...row, capturedAt: new Date() });
  }
  await batch.commit();
  return Response.json({ inserted: data.length });
}
