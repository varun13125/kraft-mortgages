"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { dscrMaxLoan, amortByTier, tierFromPoints } from "@/lib/calcs";

export default function DSCRPage() {
  const [noi, setNoi] = useState(1200000);
  const [rate, setRate] = useState(4.5);
  const [points, setPoints] = useState(100);
  const [customYears, setCustomYears] = useState<number | "">("");

  const tier = tierFromPoints(points);
  const defaultYears = amortByTier(tier);
  const years = customYears === "" ? defaultYears : Number(customYears);

  const loan = dscrMaxLoan({ noi, rateAnnual: rate, years, minDcr: 1.10 });

  return (<>
    <SectionHero title="DSCR Max Loan" subtitle="Solve for loan size that meets MLI Select’s 1.10 DCR." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>NOI (annual $)</label>
            <input type="number" value={noi} onChange={e=>setNoi(+e.target.value)} />
            <label>Interest Rate (%)</label>
            <input type="number" value={rate} step={0.05} onChange={e=>setRate(+e.target.value)} />
            <label>Total Points (to infer max amort)</label>
            <input type="number" value={points} onChange={e=>setPoints(+e.target.value)} />
            <label>Override Amortization (years)</label>
            <input type="number" placeholder={`${defaultYears}`} value={customYears as any} onChange={e=>setCustomYears(e.target.value === "" ? "" : +e.target.value)} />
            <div className="text-xs text-slate-600">Leave blank to use tier default ({defaultYears} years).</div>
          </div>
        </Card>
        <Card title="Result">
          <div className="text-sm">Max DSCR-compliant loan ≈ <b>${loan.toLocaleString()}</b> (DCR 1.10)</div>
        </Card>
      </div>
    </section>
  </>);
}
