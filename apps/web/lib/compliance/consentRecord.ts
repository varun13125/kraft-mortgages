/**
 * Server-side consent evidence for lead APIs (BUG-005, CASL + CRTC ADAD rules).
 *
 * Forms send the fields built by `consentFields()` in lib/compliance/consent.ts
 * ({ consentToContact, consentToCall, consentToMarketing, consentVersion }).
 * Kept separate from consent.ts because that module is imported by client
 * components and this one depends on server request helpers.
 *
 * Owner decision (2026-10-13): an automated AI call is placed ONLY when
 * `consentToCall === true`. Missing / false / anything else = no call.
 */
import { z } from 'zod';
import { getClientIp } from '@/lib/compliance/requestGuards';

/**
 * Zod shape to spread into a route's request schema. All fields optional, and a
 * malformed value is treated as "no consent" (false / '') rather than rejecting
 * the lead; a missing or invalid consentToCall simply means no automated call.
 * (`.catch()` values are never `undefined`, which Firestore would reject.)
 */
export const consentInputShape = {
  consentToContact: z.boolean().optional().catch(false),
  consentToCall: z.boolean().optional().catch(false),
  consentToMarketing: z.boolean().optional().catch(false),
  // e.g. "2026-10-13" (CONSENT_VERSION); short, no markup
  consentVersion: z.string().trim().max(40).regex(/^[A-Za-z0-9._:-]+$/).optional().catch(''),
};

export interface ConsentInput {
  consentToContact?: boolean;
  consentToCall?: boolean;
  consentToMarketing?: boolean;
  consentVersion?: string;
}

export interface ConsentRecord {
  consentToContact: boolean;
  /** true ONLY when the person ticked the automated-call box. */
  consentToCall: boolean;
  consentToMarketing: boolean;
  /** Version of the wording shown (CONSENT_VERSION), null for legacy forms that sent none. */
  consentVersion: string | null;
  /** Server time the consent was received (ISO 8601). */
  consentCapturedAt: string;
  /** Client IP (CASL evidence). */
  consentIp: string;
  /** Where the consent was captured. */
  consentSource: string;
}

/** Builds the consent record stored with a lead. Never trusts client timestamps. */
export function buildConsentRecord(input: ConsentInput, req: Request, source: string): ConsentRecord {
  return {
    consentToContact: input.consentToContact === true,
    consentToCall: input.consentToCall === true,
    consentToMarketing: input.consentToMarketing === true,
    consentVersion: input.consentVersion || null,
    consentCapturedAt: new Date().toISOString(),
    consentIp: getClientIp(req).slice(0, 64),
    consentSource: source.slice(0, 80),
  };
}

/** String-only form for webhook payloads (n8n / Twenty, GoHighLevel). */
export function consentRecordToStrings(record: ConsentRecord): Record<string, string> {
  return {
    consentToContact: record.consentToContact ? 'true' : 'false',
    consentToCall: record.consentToCall ? 'true' : 'false',
    consentToMarketing: record.consentToMarketing ? 'true' : 'false',
    consentVersion: record.consentVersion || '',
    consentCapturedAt: record.consentCapturedAt,
    consentIp: record.consentIp,
    consentSource: record.consentSource,
  };
}
