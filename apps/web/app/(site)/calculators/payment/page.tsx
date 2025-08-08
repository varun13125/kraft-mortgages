"use client";
import { useState } from "react";
import { payment, biweeklySavings } from "@/lib/calc/payment";
import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function PaymentCalculatorPage() {
  const [principal, setPrincipal] = useState(700000);
  const [rate, setRate] = useState(5.34);
  const [years, setYears] = useState(25);

  const monthly = payment({ principal, annualRatePct: rate, amortYears: years, paymentsPerYear: 12 });
  const { acceleratedBiweekly, annualSavings } = biweeklySavings({ principal, annualRatePct: rate, amortYears: years });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-white">Smart Mortgage Payment Calculator</h2>
      <div className="mt-2"><ComplianceBanner feature="LEAD_FORM" /></div>
      <div className="grid gap-4">
        <label className="grid gap-1 text-gray-200">Principal
          <input type="number" value={principal} onChange={e=>setPrincipal(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Rate (APR %)
          <input type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Amortization (years)
          <input type="number" value={years} onChange={e=>setYears(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="rounded-2xl p-4 metallic-card">
        <div className="text-gray-200">Monthly: <strong className="text-white">${monthly.toFixed(2)}</strong></div>
        <div className="text-gray-200">Accelerated Bi‑weekly: <strong className="text-white">${acceleratedBiweekly.toFixed(2)}</strong></div>
        <div className="text-gray-200">Projected Annual Savings: <strong className="text-gold-400">${annualSavings.toFixed(2)}</strong></div>
      </div>

      <p className="text-sm text-gray-400">Includes payment frequency comparison. Provincial taxes/fees can be layered from live data later.</p>
    </div>
  );
}
