'use client';
import { useEffect, useRef, useState } from 'react';

const YEAR_TARGET = 18;
const CLIENT_TARGET = 5000;
const FUNDED_TARGET = 2;

/**
 * Client island: animated stat counters that run once when scrolled into view.
 * Extracted from the homepage so the page itself can be a Server Component.
 *
 * The animated numbers start at 0, so the server HTML used to read
 * "0+ Years Experience / 0+ Happy Clients / $0B+ Funded" for crawlers that
 * don't run JS (incl. the AI answer-engine bots robots.ts invites) and for
 * screen readers mid-animation. The final values are now always present as
 * screen-reader/crawler text, the animated digits are aria-hidden, and users
 * with "reduce motion" get the final values immediately.
 */
export function StatsCounters() {
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setYearsCount(YEAR_TARGET);
      setClientsCount(CLIENT_TARGET);
      setFundedCount(FUNDED_TARGET);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const steps = 60;
            let currentStep = 0;
            interval = setInterval(() => {
              currentStep++;
              const progress = currentStep / steps;
              setYearsCount(Math.floor(YEAR_TARGET * progress));
              setClientsCount(Math.floor(CLIENT_TARGET * progress));
              setFundedCount(Number((FUNDED_TARGET * progress).toFixed(1)));
              if (currentStep >= steps && interval) clearInterval(interval);
            }, duration / steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-3 gap-6 mb-8">
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <span className="sr-only">{YEAR_TARGET}+ years combined experience</span>
        <div aria-hidden="true" className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{yearsCount}+</div>
        <div aria-hidden="true" className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Years Experience</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <span className="sr-only">{CLIENT_TARGET.toLocaleString('en-CA')}+ happy clients</span>
        <div aria-hidden="true" className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{clientsCount.toLocaleString('en-CA')}+</div>
        <div aria-hidden="true" className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Happy Clients</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <span className="sr-only">${FUNDED_TARGET}B+ in mortgages funded</span>
        <div aria-hidden="true" className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">${fundedCount}B+</div>
        <div aria-hidden="true" className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Funded</div>
      </div>
    </div>
  );
}
