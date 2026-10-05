'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useLiveRates } from '@/lib/useLiveRates';
import { ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

interface CalculationResult {
  monthlyPayment: number;
  biweeklyPayment: number;
  principalAmount: number;
  error: string | null;
}

export const MortgageCalculator: React.FC = () => {
  const {
    best5YrFixed,
    best3YrFixed,
    best5YrVariable,
    bestHeloc,
    bestPrivateSecond,
    loading,
  } = useLiveRates();

  const [propertyValue, setPropertyValue] = useState<string>('1000000');
  const [downPayment, setDownPayment] = useState<string>('200000');
  const [interestRate, setInterestRate] = useState<string>('4.39');
  const [amortization, setAmortization] = useState<number>(25);
  const [selectedProduct, setSelectedProduct] = useState<string>('5-Yr Fixed');
  const [hasUserEdited, setHasUserEdited] = useState<boolean>(false);

  // Automatically pre-populate default interest rate with current market best rate
  useEffect(() => {
    if (!hasUserEdited && best5YrFixed) {
      setInterestRate(best5YrFixed.toFixed(2));
    }
  }, [best5YrFixed, hasUserEdited]);

  const calculations = useMemo<CalculationResult>(() => {
    const pVal = parseFloat(propertyValue);
    const dPay = parseFloat(downPayment);
    const annualRate = parseFloat(interestRate);

    // Hardened Input Guard Validation Checks (Item 2 & 10)
    if (isNaN(pVal) || isNaN(dPay) || isNaN(annualRate)) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: 0, error: "Inputs must be valid numeric values." };
    }
    if (pVal <= 0) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: 0, error: "Property value must be greater than zero." };
    }
    if (dPay < 0) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: 0, error: "Down payment cannot be negative." };
    }
    if (dPay >= pVal) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: 0, error: "Down payment must be less than the total property value." };
    }
    if (annualRate <= 0 || annualRate > 25) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: 0, error: "Please enter a valid interest rate between 0.01% and 25%." };
    }

    const principal = pVal - dPay;
    const ltv = (principal / pVal) * 100;
    if (ltv > 95) {
      return { monthlyPayment: 0, biweeklyPayment: 0, principalAmount: principal, error: "Minimum down payment rule violation. Max allowed LTV under Canadian guidelines is 95%." };
    }

    // Canadian Legal Compounding Interest Conversion Logic (Item 1 & 11)
    const rDecimal = annualRate / 100;
    const effectiveMonthlyRate = Math.pow(1 + rDecimal / 2, 2 / 12) - 1;
    const totalMonths = amortization * 12;

    const monthlyPayment = 
      (principal * effectiveMonthlyRate * Math.pow(1 + effectiveMonthlyRate, totalMonths)) / 
      (Math.pow(1 + effectiveMonthlyRate, totalMonths) - 1);

    const finalizedMonthly = isFinite(monthlyPayment) ? Math.round(monthlyPayment * 100) / 100 : 0;
    
    // Standard Canadian banking practice for regular bi-weekly payment intervals
    const finalizedBiweekly = Math.round((finalizedMonthly / 2) * 100) / 100;

    return {
      monthlyPayment: finalizedMonthly,
      biweeklyPayment: finalizedBiweekly,
      principalAmount: principal,
      error: null
    };
  }, [propertyValue, downPayment, interestRate, amortization]);

  const selectRatePreset = (label: string, rateVal: number) => {
    setInterestRate(rateVal.toFixed(2));
    setSelectedProduct(label);
    setHasUserEdited(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl text-white shadow-2xl">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-bold text-emerald-400">Canadian Compliance Mortgage Calculator</h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Live Rate Synced</span>
        </div>
      </div>
      
      {calculations.error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-200 rounded-md text-sm">
          ⚠️ {calculations.error}
        </div>
      )}

      {/* Quick Rate Preset Selector from Live Feeds */}
      <div className="mb-5 p-3 rounded-lg bg-slate-950/70 border border-slate-800">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-gold-400" />
          Today&apos;s Verified Benchmarks (Click to Apply)
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: '5-Yr Fixed', rate: best5YrFixed },
            { label: '3-Yr Fixed', rate: best3YrFixed },
            { label: '5-Yr Variable', rate: best5YrVariable },
            { label: 'HELOC', rate: bestHeloc },
            { label: 'Private 2nd', rate: bestPrivateSecond },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => selectRatePreset(preset.label, preset.rate)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                selectedProduct === preset.label && interestRate === preset.rate.toFixed(2)
                  ? 'bg-gold-500 text-black border-gold-400 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-gold-500/50 hover:text-white'
              }`}
            >
              {preset.label}: <span className="font-bold">{preset.rate.toFixed(2)}%</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Property Value (CAD)</label>
          <input 
            type="number" 
            value={propertyValue} 
            onChange={(e) => setPropertyValue(e.target.value)} 
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Down Payment (CAD)</label>
          <input 
            type="number" 
            value={downPayment} 
            onChange={(e) => setDownPayment(e.target.value)} 
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase text-slate-400">Annual Interest Rate (%)</label>
            <span className="text-[11px] text-gold-400/90 font-medium">
              {hasUserEdited ? 'Custom rate applied' : `Pre-populated with today's best (${interestRate}%)`}
            </span>
          </div>
          <input 
            type="number" 
            step="0.01"
            value={interestRate} 
            onChange={(e) => {
              setInterestRate(e.target.value);
              setHasUserEdited(true);
            }} 
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Amortization Period</label>
          <select 
            value={amortization} 
            onChange={(e) => setAmortization(Number(e.target.value))}
            className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500"
          >
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={25}>25 Years</option>
            <option value={30}>30 Years</option>
          </select>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-950 rounded">
          <span className="text-xs text-slate-400 block">Monthly Payment</span>
          <span className="text-xl font-bold text-white">${calculations.monthlyPayment.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-slate-950 rounded">
          <span className="text-xs text-slate-400 block">Bi-Weekly Payment</span>
          <span className="text-xl font-bold text-emerald-400">${calculations.biweeklyPayment.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
