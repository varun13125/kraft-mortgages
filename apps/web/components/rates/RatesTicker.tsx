'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLiveRates } from '@/lib/useLiveRates';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const RatesTicker: React.FC = () => {
  const { data, best5YrFixed, best3YrFixed, best5YrVariable, bestHeloc, bestPrivateSecond, primeRate } = useLiveRates();

  const tickerItems = [
    {
      label: '5-Yr Fixed (Insured)',
      rate: `From ${best5YrFixed.toFixed(2)}%`,
      sub: 'Fixed',
      highlight: true,
    },
    {
      label: '3-Yr Fixed (Insured)',
      rate: `From ${best3YrFixed.toFixed(2)}%`,
      sub: 'Fixed',
    },
    {
      label: '5-Yr Variable ARM',
      rate: `From ${best5YrVariable.toFixed(2)}%`,
      sub: data?.benchmarks?.variable_5yr?.insured?.lowest_spread || 'Prime - 1.01%',
      highlight: true,
    },
    {
      label: 'HELOC (1st Pos)',
      rate: `From ${bestHeloc.toFixed(2)}%`,
      sub: 'Revolving',
    },
    {
      label: 'Private 2nd Mtg',
      rate: `From ${bestPrivateSecond.toFixed(2)}%`,
      sub: 'Fast Equity',
    },
    {
      label: 'BoC Prime Benchmark',
      rate: `${primeRate.toFixed(2)}%`,
      sub: 'Bank of Canada',
      prime: true,
    },
  ];

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-y border-gold-500/20 py-2.5 px-4 overflow-hidden relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left Freshness Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Updated Today
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">30+ Verified Lenders</span>
        </div>

        {/* Center / Scrolling Rate Pills */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
          {tickerItems.map((item, idx) => (
            <Link
              key={idx}
              href="/#todays-rates"
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all hover:scale-105 ${
                item.highlight
                  ? 'bg-gold-500/10 border-gold-500/30 text-gold-300 hover:border-gold-400'
                  : item.prime
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="text-slate-400">{item.label}:</span>
              <span className="font-bold text-white tracking-tight">{item.rate}</span>
              <span className="text-[10px] text-gold-400/80 font-medium">({item.sub})</span>
            </Link>
          ))}
        </div>

        {/* Right CTA Link */}
        <div className="shrink-0 hidden lg:flex items-center gap-1 text-gold-400 hover:text-gold-300 font-medium transition-colors">
          <Link href="/#todays-rates" className="flex items-center gap-1 hover:underline">
            <span>Explore All Rates</span>
            <TrendingUp className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
