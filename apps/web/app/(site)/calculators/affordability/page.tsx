"use client";
import { useState, useMemo } from "react";
import { stressTestRate, gdsTds } from "@/lib/calc/affordability";
import { payment } from "@/lib/calc/payment";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function Affordability() {
  const [income, setIncome] = useState(120000);
  const [debts, setDebts] = useState(6000); // annual non‑housing
  const [propTax, setPropTax] = useState(3000);
  const [heat, setHeat] = useState(1200);
  const [condoFees, setCondoFees] = useState(0);
  const [rate, setRate] = useState(5.35);
  const [principal, setPrincipal] = useState(650000);
  const qualRate = useMemo(() => stressTestRate(rate), [rate]);
  const monthlyPI = payment({ principal, annualRatePct: qualRate, amortYears: 25, paymentsPerYear: 12 });
  const housingAnnual = monthlyPI * 12 + propTax + heat + condoFees * 12;
  const { gds, tds } = gdsTds({ incomeAnnual: income, housingCostsAnnual: housingAnnual, totalDebtAnnual: debts });
  const pass = gds <= 39 && tds <= 44; // typical guideline

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-white">Affordability Calculator</h2>
      <div className="mt-2"><ComplianceBanner feature="LEAD_FORM" /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-gray-200">Household Income (annual)
          <input type="number" value={income} onChange={e=>setIncome(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Other Debts (annual)
          <input type="number" value={debts} onChange={e=>setDebts(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Quoted Rate (APR %)
          <input type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Mortgage Principal
          <input type="number" value={principal} onChange={e=>setPrincipal(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Property Tax (annual)
          <input type="number" value={propTax} onChange={e=>setPropTax(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Heating (annual)
          <input type="number" value={heat} onChange={e=>setHeat(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="grid gap-1 text-gray-200">Condo Fees (monthly)
          <input type="number" value={condoFees} onChange={e=>setCondoFees(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="rounded-2xl p-4 bg-gray-800 border border-gray-700 space-y-2">
        <div className="text-gray-200">Qualifying Rate: <strong className="text-white">{qualRate.toFixed(2)}%</strong></div>
        <div className="text-gray-200">Monthly P&I (@ stress test): <strong className="text-white">${monthlyPI.toFixed(2)}</strong></div>
        <div className="text-gray-200">GDS: <strong className="text-white">{gds.toFixed(1)}%</strong> · TDS: <strong className="text-white">{tds.toFixed(1)}%</strong></div>
        <div className={pass?"text-green-400":"text-red-400"}>{pass?"Within typical guidelines":"Above typical guidelines"}</div>
        <p className="text-xs text-gray-400">Guidelines vary by lender and program; educational only.</p>
      </div>
    </div>
  );
}
