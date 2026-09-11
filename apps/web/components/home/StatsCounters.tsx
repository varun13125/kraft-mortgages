'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Client island: animated stat counters that run once when scrolled into view.
 * Extracted from the homepage so the page itself can be a Server Component.
 */
export function StatsCounters() {
  const [yearsCount, setYearsCount] = useState(0);
  const [clientsCount, setClientsCount] = useState(0);
  const [fundedCount, setFundedCount] = useState(0);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const duration = 2000;
            const steps = 60;
            const yearTarget = 18;
            const clientTarget = 5000;
            const fundedTarget = 2;
            let currentStep = 0;
            const interval = setInterval(() => {
              currentStep++;
              const progress = currentStep / steps;
              setYearsCount(Math.floor(yearTarget * progress));
              setClientsCount(Math.floor(clientTarget * progress));
              setFundedCount(Number((fundedTarget * progress).toFixed(1)));
              if (currentStep >= steps) clearInterval(interval);
            }, duration / steps);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-3 gap-6 mb-8">
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{yearsCount}+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Years Experience</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">{clientsCount.toLocaleString()}+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Happy Clients</div>
      </div>
      <div className="text-center p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 backdrop-blur-sm">
        <div className="text-3xl font-bold bg-gradient-to-br from-gold-300 to-amber-500 bg-clip-text text-transparent">${fundedCount}B+</div>
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Funded</div>
      </div>
    </div>
  );
}
