import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const score = Math.min(100, Math.round((body?.income ?? 0) / 1000 + (body?.downPayment ?? 0) / 10000));
  const lead = await prisma.lead.create({ data: { province: body.province, intent: body.intent, details: body, score, status: (score>=90? "QUALIFIED":"NEW") as any } });
  return Response.json({ id: lead.id, score });
}
