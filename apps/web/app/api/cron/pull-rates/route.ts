import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { firestore } from "@/lib/firebaseAdmin";
import { requireAdmin, verifyCronRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function authorize(req: NextRequest): Promise<Response | null> {
  // SECURITY: previously unauthenticated - anyone could trigger DB writes.
  if (verifyCronRequest(req).ok) return null;
  const admin = await requireAdmin(req);
  return admin.ok ? null : Response.json({ error: admin.error }, { status: admin.status });
}

async function handler(req: NextRequest) {
  const denied = await authorize(req);
  if (denied) return denied;

  const url = process.env.FASTAPI_BASE_URL;
  if (!url) {
    // The old default (http://localhost:8000) can never work on Vercel.
    return Response.json({ error: "FASTAPI_BASE_URL is not configured" }, { status: 503 });
  }

  try {
    const r = await fetch(`${url}/lenders/aggregate`, { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ province: null }) });
    if (!r.ok) {
      return Response.json({ error: `Rate aggregator returned HTTP ${r.status}` }, { status: 502 });
    }
    const payload = await r.json().catch(() => null);
    const rows: any[] = Array.isArray(payload?.rows) ? payload.rows : [];
    const data = rows.filter((x:any)=> x && !x.error).map((x:any)=> ({
      lender: String(x.lender).slice(0, 200),
      termMonths: Number(x.termMonths||0),
      rateAPR: Number(x.rateAPR||0),
      province: ["BC", "AB", "ON"].includes(x.province) ? x.province : null
    })).filter(x => Number.isFinite(x.rateAPR) && x.rateAPR > 0 && x.rateAPR < 30);
    if (!data.length) return Response.json({ inserted: 0 });
    if (process.env.DATABASE_URL) {
      await prisma.rateSnapshot.createMany({ data, skipDuplicates: false });
      return Response.json({ inserted: data.length });
    }
    const db = firestore();
    const batch = db.batch();
    for (const row of data.slice(0, 450)) { // Firestore batch limit is 500 writes
      const ref = db.collection("rateSnapshots").doc();
      batch.set(ref, { ...row, capturedAt: new Date() });
    }
    await batch.commit();
    return Response.json({ inserted: Math.min(data.length, 450) });
  } catch (error) {
    console.error("[cron/pull-rates] failed:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Rate pull failed" }, { status: 500 });
  }
}

export const POST = handler;
// Vercel Cron invokes GET
export const GET = handler;
