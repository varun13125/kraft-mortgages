import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { firestore } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const score = Math.min(100, Math.round((body?.income ?? 0) / 1000 + (body?.downPayment ?? 0) / 10000));
  if ((prisma as any) instanceof PrismaClient) {
    const lead = await (prisma as PrismaClient).lead.create({ data: { province: body.province, intent: body.intent, details: body, score, status: (score>=90? "QUALIFIED":"NEW") as any } });
    return Response.json({ id: lead.id, score });
  }
  const db = firestore();
  const doc = await db.collection("leads").add({ province: body.province, intent: body.intent, details: body, score, status: score>=90? "QUALIFIED":"NEW", createdAt: new Date() });
  return Response.json({ id: doc.id, score });
}
