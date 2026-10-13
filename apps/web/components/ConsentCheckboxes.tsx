'use client';
import type { ReactNode } from 'react';
import { CONSENT_TEXT } from '@/lib/compliance/consent';

interface Box {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Lead-form consent block (BUG-005, owner decision 2026-10-13).
 *
 * - Optional checkboxes, never pre-ticked; labels are the exact CONSENT_TEXT strings
 *   (the API records CONSENT_VERSION, so the wording must not be edited here).
 * - `call` is only rendered for forms that post to /api/contact (the endpoint that
 *   places the automated AI call). The call is placed only when this box is ticked.
 * - CONSENT_TEXT.notice is always shown underneath; pass the Privacy Policy link
 *   (or other trailing text) as children.
 *
 * Native checkbox + <label htmlFor> so it is keyboard operable and announced
 * correctly; visible focus ring on dark backgrounds.
 */
export function ConsentCheckboxes({
  idPrefix,
  call,
  marketing,
  children,
  className = '',
}: {
  /** Unique per form on the page, e.g. "contact" -> ids contact-consent-call / -marketing. */
  idPrefix: string;
  call?: Box;
  marketing: Box;
  children?: ReactNode;
  className?: string;
}) {
  const boxClass =
    'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-500 bg-gray-900 accent-[#d4af37] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900';
  const labelClass = 'cursor-pointer text-xs sm:text-sm leading-relaxed text-gray-300';

  return (
    <fieldset className={`space-y-3 text-left ${className}`}>
      <legend className="sr-only">Contact preferences (optional)</legend>
      {call && (
        <div className="flex items-start gap-3">
          <input
            id={`${idPrefix}-consent-call`}
            type="checkbox"
            checked={call.checked}
            onChange={(e) => call.onChange(e.target.checked)}
            className={boxClass}
          />
          <label htmlFor={`${idPrefix}-consent-call`} className={labelClass}>
            {CONSENT_TEXT.call}
          </label>
        </div>
      )}
      <div className="flex items-start gap-3">
        <input
          id={`${idPrefix}-consent-marketing`}
          type="checkbox"
          checked={marketing.checked}
          onChange={(e) => marketing.onChange(e.target.checked)}
          className={boxClass}
        />
        <label htmlFor={`${idPrefix}-consent-marketing`} className={labelClass}>
          {CONSENT_TEXT.marketing}
        </label>
      </div>
      <p className="text-xs leading-relaxed text-gray-400">
        {CONSENT_TEXT.notice}
        {children ? <> {children}</> : null}
      </p>
    </fieldset>
  );
}
