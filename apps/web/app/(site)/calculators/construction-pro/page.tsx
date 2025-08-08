"use client";
import { useMemo, useState } from "react";
import { interestOnlyCost } from "@/lib/calc/construction";

import { ComplianceBanner } from "@/components/ComplianceBanner";

export default function ConstructionPro() {
  const [rate, setRate] = useState(7.25);
  const [draws, setDraws] = useState([{ month:1, amount:200000 }, { month:4, amount:250000 }, { month:7, amount:300000 }] as {month:number,amount:number}[]);
  const result = useMemo(()=>interestOnlyCost({ draws, annualRatePct: rate }), [draws, rate]);

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-semibold text-white">Construction Pro Calculator</h2>
      <div className="mt-2"><ComplianceBanner feature="CALC_CONSTRUCTION" /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-gray-200">Construction Rate (APR %)
          <input type="number" step="0.01" value={rate} onChange={e=>setRate(+e.target.value)} className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" />
        </label>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-200">Draw Schedule</div>
        {draws.map((d,i)=> (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={d.month} onChange={e=>setDraws(prev=>prev.map((x,j)=> j===i?{...x, month:+e.target.value}:x))} />
            <input className="bg-gray-700 border border-gray-600 rounded p-2 text-white placeholder-gray-400 focus:border-gold-500 focus:outline-none" type="number" value={d.amount} onChange={e=>setDraws(prev=>prev.map((x,j)=> j===i?{...x, amount:+e.target.value}:x))} />
          </div>
        ))}
        <button className="text-sm underline text-gold-400 hover:text-gold-300" onClick={()=>setDraws(d=>[...d,{month:(d.at(-1)?.month||1)+1, amount:100000}])}>+ Add draw</button>
      </div>

      <div className="rounded-2xl bg-gray-800 border border-gray-700 p-4 space-y-2">
        <div className="text-gray-200">Total Interest (construction period): <strong className="text-gold-400">${result.totalInterest.toFixed(2)}</strong></div>
        <div className="text-xs text-gray-400">Assumes interest‑only during build; finalize with lender draw timing & compounding.</div>
      </div>
    </div>
  );
}
