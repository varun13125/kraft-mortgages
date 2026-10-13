import { BUSINESS } from '@/lib/seo/business-config';

/**
 * Single source of truth for lead-form consent wording (CASL + CRTC automated-call rules).
 *
 * Every lead form renders these exact strings and submits `CONSENT_VERSION`, so the CRM
 * record proves which wording a person agreed to. Owner decision (2026-10-13): an
 * automated AI call is placed ONLY when `consentToCall === true` (box ticked, never
 * pre-ticked). Bump CONSENT_VERSION whenever any text below changes.
 *
 * Draft wording — pending legal review (see DEVLOG FINDINGS BUG-005).
 */
export const CONSENT_VERSION = '2026-10-13';

const SENDER = `${BUSINESS.legalName}, ${BUSINESS.address.streetAddress}, ${BUSINESS.address.addressLocality}, ${BUSINESS.address.addressRegion}, ${BUSINESS.email}`;

export const CONSENT_TEXT = {
  /** Optional checkbox (unticked by default). Ticked → instant automated AI call. */
  call:
    'Yes, call me now. I agree to receive an automated phone call from Kraft Mortgages’ AI assistant at the number above about my inquiry. Calls may be recorded for quality and training.',
  /** Optional checkbox (unticked by default) for ongoing marketing (CASL express consent). */
  marketing:
    'Send me mortgage tips, rate updates and offers from Kraft Mortgages by email and text message.',
  /** Shown under the checkboxes on every form (sender identification + withdrawal). */
  notice: `We’ll use your details to respond to your inquiry. You can withdraw consent at any time by replying STOP, using the unsubscribe link, or contacting ${SENDER}.`,
} as const;

export interface ConsentFields {
  /** Responding to the person's own inquiry (implied consent under CASL). */
  consentToContact: true;
  /** Express consent to an automated (AI) call — only `true` permits auto-dialing. */
  consentToCall: boolean;
  /** Express consent to marketing messages. */
  consentToMarketing: boolean;
  consentVersion: string;
}

/** Build the consent fields a form sends to the lead APIs. */
export function consentFields(call: boolean, marketing: boolean): ConsentFields {
  return {
    consentToContact: true,
    consentToCall: call === true,
    consentToMarketing: marketing === true,
    consentVersion: CONSENT_VERSION,
  };
}
