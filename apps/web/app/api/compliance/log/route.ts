import { NextRequest } from 'next/server';
import { z } from 'zod';
import { logCompliance } from '@/lib/compliance';
import { limitByIp } from '@/lib/compliance/requestGuards';

export const dynamic = 'force-dynamic';

const ComplianceEventSchema = z.object({
  type: z.enum(['AML_KYC', 'CONSENT', 'DISCLOSURE', 'DOCUMENT_UPLOAD']),
  userId: z.string().max(128).optional(),
  meta: z.record(z.union([z.string().max(500), z.number(), z.boolean(), z.null()])).optional(),
});

export async function POST(req: NextRequest) {
  // Public endpoint: validate + cap so it can't be used to flood/inject logs.
  const limited = limitByIp(req, 'compliance-log', 30, 60 * 1000);
  if (limited) return limited;

  const parsed = ComplianceEventSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ ok: false, error: 'Invalid compliance event' }, { status: 400 });
  }
  if (parsed.data.meta && Object.keys(parsed.data.meta).length > 30) {
    return Response.json({ ok: false, error: 'Too many meta fields' }, { status: 400 });
  }
  await logCompliance(parsed.data);
  return Response.json({ ok: true });
}
