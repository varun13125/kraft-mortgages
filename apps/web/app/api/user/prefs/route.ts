import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const prefs = await prisma.preference.findMany({ take: 100 });
  return Response.json(prefs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, key, value } = body;
  if (!userId || !key) return new Response("Missing userId/key", { status: 400 });
  const pref = await prisma.preference.upsert({
    where: { userId_key: { userId, key } },
    create: { userId, key, value },
    update: { value }
  });
  return Response.json(pref);
}
