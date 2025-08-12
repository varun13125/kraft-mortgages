"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { premiumDiscountFor, tierFromPoints } from "@/lib/calcs";

export default function PremiumPage() {
  const [loan, setLoan] = useState(15000000);
  const [baseRate, setBaseRate] = useState(6.0);
  const [points, setPoints] = useState(100);

  const tier = tierFromPoints(points);
  const disc = premiumDiscountFor(tier);
  const before = loan * (baseRate/100);
  const after = before * (1 - disc);
  const financed = loan + after;

  return (<>
    <SectionHero title="Insurance Premium" subtitle="Estimate CMHC premium with tier discounts." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>Loan Amount ($)</label>
            <input type="number" value={loan} onChange={e=>setLoan(+e.target.value)} />
            <label>Base Premium Rate (%)</label>
            <input type="number" step={0.05} value={baseRate} onChange={e=>setBaseRate(+e.target.value)} />
            <label>Total Points</label>
            <input type="number" value={points} onChange={e=>setPoints(+e.target.value)} />
            <div className="text-xs text-slate-600">Discount auto-applies by tier.</div>
          </div>
        </Card>
        <Card title="Results">
          <div className="grid gap-2 text-sm">
            <div>Tier: <b>{tier || "—"}</b></div>
            <div>Discount: <b>{Math.round(disc*100)}%</b></div>
            <div>Premium (before): <b>${Math.round(before).toLocaleString()}</b></div>
            <div>Premium (after): <b>${Math.round(after).toLocaleString()}</b></div>
            <div>Financed Total (loan + premium): <b>${Math.round(financed).toLocaleString()}</b></div>
          </div>
        </Card>
      </div>
    </section>
  </>);
}
