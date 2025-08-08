import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { firestore } from "@/lib/firebaseAdmin";

export async function GET() {
  if ((prisma as any) instanceof PrismaClient) {
    const prefs = await (prisma as PrismaClient).preference.findMany({ take: 100 });
    return Response.json(prefs);
  }
  const db = firestore();
  const snap = await db.collection("preferences").limit(100).get();
  const prefs = snap.docs.map(d=> ({ id: d.id, ...(d.data() as any) }));
  return Response.json(prefs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, key, value } = body;
  if (!userId || !key) return new Response("Missing userId/key", { status: 400 });
  if ((prisma as any) instanceof PrismaClient) {
    const pref = await (prisma as PrismaClient).preference.upsert({
      where: { userId_key: { userId, key } },
      create: { userId, key, value },
      update: { value }
    });
    return Response.json(pref);
  }
  const db = firestore();
  const ref = db.collection("preferences").doc(`${userId}:${key}`);
  await ref.set({ userId, key, value, updatedAt: new Date() }, { merge: true });
  const snap = await ref.get();
  return Response.json({ id: ref.id, ...(snap.data() as any) });
}
