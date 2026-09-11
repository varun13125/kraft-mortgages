'use client';
import { useState } from 'react';
import { LeadModal } from './LeadModal';
import { BUSINESS } from '@/lib/seo/business-config';

/**
 * Client island wrapping the hero CTAs so the lead modal works without making
 * the whole homepage a client component. The rest of the hero (headline, copy,
 * stats) stays server-rendered.
 */
export function HeroCTAs() {
  const [showLeadForm, setShowLeadForm] = useState(false);
  return (
    <>
      <div className="flex flex-wrap gap-4">
        <a href="https://r.mtg-app.com/varun-chaudhry" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
          Start Application
        </a>
        <button onClick={() => setShowLeadForm(true)}
          className="inline-flex items-center justify-center px-6 py-3.5 border border-gold-500/40 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-all hover:border-gold-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          Get Free Analysis
        </button>
        <a href={`tel:${BUSINESS.telephoneDisplay}`}
          className="inline-flex items-center justify-center px-6 py-3.5 border border-gold-500/40 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-all hover:border-gold-400 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          Call {BUSINESS.telephoneDisplay}
        </a>
      </div>
      <LeadModal open={showLeadForm} selectedCalculator={null} onClose={() => setShowLeadForm(false)} />
    </>
  );
}
