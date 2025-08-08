import { NextRequest } from 'next/server';
import { logCompliance } from '@/lib/compliance';

export async function POST(req: NextRequest) {
  const payload = await req.json();
  await logCompliance(payload);
  return Response.json({ ok: true });
}
