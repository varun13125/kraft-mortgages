'use client';

import React, { useState, useMemo } from 'react';

interface CalculationResult {
  monthlyPayment: number;
  biweeklyPayment: number;
  principalAmount: number;
  error: string | null;
}

export const MortgageCalculator: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('1000000');
  const [downPayment, setDownPayment] = useState<string>('200000');
  const [interestRate, setInterestRate] = useState<string>('5.0');
  const [amortization, setAmortization] = useState<number>(25);

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

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-4 text-emerald-400">Canadian Compliance Mortgage Calculator</h2>
      
      {calculations.error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-200 rounded-md text-sm">
          ⚠️ {calculations.error}
        </div>
      )}

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
          <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Annual Interest Rate (%)</label>
          <input 
            type="number" 
            step="0.01"
            value={interestRate} 
            onChange={(e) => setInterestRate(e.target.value)} 
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
