'use client';
import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BorderRotate } from '@/components/ui/animated-gradient-border';
import { BUSINESS } from '@/lib/seo/business-config';
import { ConsentCheckboxes } from '@/components/ConsentCheckboxes';
import { consentFields } from '@/lib/compliance/consent';

interface LeadModalProps {
  open: boolean;
  selectedCalculator: string | null;
  onClose: () => void;
}

/**
 * Client island: lead-capture modal. Extracted from the homepage so the page
 * can be a Server Component. Each input has an accessible aria-label.
 *
 * Audit fixes (2026-10): dialog semantics (role/aria-modal/labelledby), Escape
 * and a visible close button; failed submissions are no longer reported as a
 * success; the "will never be shared" claim (contradicted by the Privacy Policy,
 * which discloses sharing with lenders/insurers) is replaced with a policy link.
 */
export function LeadModal({ open, selectedCalculator, onClose }: LeadModalProps) {
  const titleId = useId();
  const [leadData, setLeadData] = useState({
    name: '', email: '', phone: '', loanAmount: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  // CASL marketing opt-in (BUG-005): optional, unticked by default. No call box here:
  // this form posts to /api/lead, which never places an automated call.
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          calculatorType: selectedCalculator || '',
          ...consentFields(false, marketingConsent),
        }),
      });
      if (!res.ok) throw new Error(`Lead submit failed: HTTP ${res.status}`);
      if (selectedCalculator) {
        await fetch('/api/calculator-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...leadData, calculatorType: selectedCalculator }),
        });
      }
      // (No email provider is wired up for reports yet — see app/api/calculator-report —
      // so don't tell people to check their inbox.)
      alert(
        selectedCalculator
          ? 'Thank you! We\'ll be in touch shortly with your personalized report.'
          : 'Thank you! A licensed mortgage broker will be in touch shortly.'
      );
      setLeadData({ name: '', email: '', phone: '', loanAmount: '', message: '' });
      setMarketingConsent(false);
      onClose();
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Keep the form open with the user's data so nothing is lost.
      alert(`Sorry, we couldn't submit your request. Please try again or call us at ${BUSINESS.telephoneDisplay}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-w-md w-full"
          >
            <BorderRotate animationSpeed={4} borderRadius={16} borderWidth={2} backgroundColor="#1f2937"
              className="w-full p-8 shadow-2xl backdrop-blur-xl relative"
              gradientColors={{ primary: '#584827', secondary: '#c7a03c', accent: '#f9de90' }}>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-700/60 transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
              <h3 id={titleId} className="text-xl font-bold text-gray-100 mb-6 pr-8">
                {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required aria-label="Full Name" autoComplete="name" autoFocus
                  className={inputClass}
                  value={leadData.name} onChange={(e) => setLeadData({ ...leadData, name: e.target.value })} />
                <input type="email" placeholder="Email Address" required aria-label="Email Address" autoComplete="email"
                  className={inputClass}
                  value={leadData.email} onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} />
                <input type="tel" placeholder="Phone Number" required aria-label="Phone Number" autoComplete="tel"
                  className={inputClass}
                  value={leadData.phone} onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })} />
                <input type="text" placeholder="Loan Amount Needed (e.g. $500,000)" aria-label="Loan Amount"
                  className={inputClass}
                  value={leadData.loanAmount} onChange={(e) => setLeadData({ ...leadData, loanAmount: e.target.value })} />
                <textarea placeholder="Tell us about your mortgage needs..." rows={3} aria-label="Message"
                  className={`${inputClass} resize-none`}
                  value={leadData.message} onChange={(e) => setLeadData({ ...leadData, message: e.target.value })} />
                <ConsentCheckboxes
                  idPrefix="lead-modal"
                  marketing={{ checked: marketingConsent, onChange: setMarketingConsent }}
                />
                <button type="submit" disabled={submitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Sending…' : selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Your information is kept confidential and handled in accordance with our{' '}
                <Link href="/privacy" className="underline hover:text-gold-400">Privacy Policy</Link>.
              </p>
            </BorderRotate>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
