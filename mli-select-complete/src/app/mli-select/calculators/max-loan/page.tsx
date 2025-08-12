"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { tierFromPoints, leverageFor, maxLoanFromValueOrCost } from "@/lib/calcs";

export default function MaxLoanPage() {
  const [projectType, setProjectType] = useState<"new"|"existing">("new");
  const [points, setPoints] = useState(100);
  const [valueOrCost, setValueOrCost] = useState(20000000);

  const tier = tierFromPoints(points);
  const leverage = leverageFor(projectType === "new", tier);
  const loan = maxLoanFromValueOrCost(projectType==="new", tier, valueOrCost);
  const equity = Math.max(0, valueOrCost - loan);

  return (<>
    <SectionHero title="Max Loan / Equity" subtitle="Compute maximum loan amount and minimum equity by tier." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>Project Type</label>
            <select value={projectType} onChange={e=>setProjectType(e.target.value as any)}>
              <option value="new">New (LTC)</option>
              <option value="existing">Existing (LTV)</option>
            </select>
            <label>Total Project Cost / Property Value ($)</label>
            <input type="number" value={valueOrCost} onChange={e=>setValueOrCost(+e.target.value)} />
            <label>Total Points</label>
            <input type="number" value={points} onChange={e=>setPoints(+e.target.value)} />
            <div className="text-xs text-slate-600">Tip: Use the Points calculator first, then paste total here.</div>
          </div>
        </Card>
        <Card title="Results">
          <div className="grid gap-2 text-sm">
            <div>Tier: <b>{tier || "—"}</b></div>
            <div>Leverage: <b>{(leverage*100||0).toFixed(0)}%</b></div>
            <div>Max Loan: <b>${loan.toLocaleString()}</b></div>
            <div>Min Equity: <b>${equity.toLocaleString()}</b></div>
          </div>
        </Card>
      </div>
    </section>
  </>);
}
