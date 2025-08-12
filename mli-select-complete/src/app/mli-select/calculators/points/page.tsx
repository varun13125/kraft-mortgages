"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import TierBadge from "@/components/TierBadge";
import {
  affordabilityPoints,
  energyPoints,
  accessibilityPoints,
  totalPointsCalc,
  tierFromPoints,
  amortByTier,
  leverageFor,
  maxLoanFromValueOrCost,
  pmt,
} from "@/lib/calcs";
import { downloadCSV, downloadJSON } from "@/lib/export";

export default function PointsPage() {
  const [name, setName] = useState("Scenario A");
  const [projectType, setProjectType] = useState<"new"|"existing">("new");
  const [units, setUnits] = useState(100);
  const [affUnits, setAffUnits] = useState(25);
  const [affYears, setAffYears] = useState(10);
  const [energyPct, setEnergyPct] = useState(25);

  const [visitAll, setVisitAll] = useState(true);
  const [commons, setCommons] = useState(true);
  const [accPct, setAccPct] = useState(15);
  const [udPct, setUdPct] = useState(0);
  const [rhf, setRhf] = useState(0);

  const pctAff = units ? (affUnits / units) * 100 : 0;
  const aPts = affordabilityPoints(projectType === "new", pctAff, affYears);
  const ePts = energyPoints(energyPct);
  const accPts = accessibilityPoints({
    visitableAll: visitAll,
    commonsBarrierFree: commons,
    pctAccessible: accPct,
    pctUniversal: udPct,
    rhfScore: rhf
  });
  const total = totalPointsCalc(aPts, ePts, accPts);
  const tier = tierFromPoints(total);
  const amort = amortByTier(tier);
  const leverage = leverageFor(projectType === "new", tier);

  const snapshot = {
    name, projectType, units, affUnits, affYears, energyPct, visitAll, commons, accPct, udPct, rhf,
    points: { affordability: aPts, energy: ePts, accessibility: accPts, total, tier, amort, leverage }
  };

  function saveScenario() {
    const key = "mli:scenarios";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift({ ...snapshot, savedAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr.slice(0, 24)));
    alert("Saved.");
  }

  function printPDF() { window.print(); }

  function exportCSV() {
    const flat = [{
      name, projectType, units, affUnits, affYears, energyPct, visitAll, commons, accPct, udPct, rhf,
      aPts, ePts, accPts, total, tier, amort, leverage
    }];
    downloadCSV(`${name.replace(/\s+/g,'_')}_points.csv`, flat);
  }

  function exportJSON() {
    downloadJSON(`${name.replace(/\s+/g,'_')}_points.json`, snapshot);
  }

  return (
    <>
      <SectionHero title="Points & Tier" subtitle="Estimate your MLI Select score across all three outcomes." />
      <section className="section-pad">
        <div className="container-tight grid gap-6 lg:grid-cols-3">
          <Card title="Inputs">
            <div className="grid gap-3">
              <label>Scenario Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="My scenario" />

              <label>Project Type</label>
              <select value={projectType} onChange={e=>setProjectType(e.target.value as any)}>
                <option value="new">New Construction</option>
                <option value="existing">Existing Property</option>
              </select>

              <label>Total Units</label>
              <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} />

              <label>Affordable Units</label>
              <input type="number" value={affUnits} onChange={e=>setAffUnits(+e.target.value)} />

              <label>Affordability Commitment (years)</label>
              <input type="number" value={affYears} onChange={e=>setAffYears(+e.target.value)} />

              <label>Energy Improvement (%)</label>
              <input type="number" value={energyPct} onChange={e=>setEnergyPct(+e.target.value)} />

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={visitAll} onChange={e=>setVisitAll(e.target.checked)} />
                  All units visitable
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={commons} onChange={e=>setCommons(e.target.checked)} />
                  Barrier-free commons
                </label>
              </div>

              <label>Fully Accessible Units (% of total)</label>
              <input type="number" value={accPct} onChange={e=>setAccPct(+e.target.value)} />

              <label>Universal Design Units (% of total)</label>
              <input type="number" value={udPct} onChange={e=>setUdPct(+e.target.value)} />

              <label>RHF Accessibility Score</label>
              <input type="number" value={rhf} onChange={e=>setRhf(+e.target.value)} />

              <div className="flex flex-wrap gap-3 pt-2">
                <button className="btn btn-outline" onClick={saveScenario}>Save</button>
                <button className="btn btn-primary" onClick={printPDF}>Print / PDF</button>
                <button className="btn btn-outline" onClick={exportCSV}>Export CSV</button>
                <button className="btn btn-outline" onClick={exportJSON}>Export JSON</button>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 grid gap-6">
            <Card title="Results">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="card"><div className="card-body">
                  <div className="font-semibold">Affordability</div>
                  <div className="mt-1 text-slate-600">{((affUnits/units)*100||0).toFixed(1)}% units • {affYears} years</div>
                  <div className="mt-1">Points: <b>{aPts}</b></div>
                </div></div>
                <div className="card"><div className="card-body">
                  <div className="font-semibold">Energy</div>
                  <div className="mt-1 text-slate-600">{energyPct}% improvement</div>
                  <div className="mt-1">Points: <b>{ePts}</b></div>
                </div></div>
                <div className="card"><div className="card-body">
                  <div className="font-semibold">Accessibility</div>
                  <div className="mt-1 text-slate-600">Points</div>
                  <div className="mt-1">Points: <b>{accPts}</b></div>
                </div></div>
                <div className="card"><div className="card-body">
                  <div className="font-semibold">Total</div>
                  <div className="mt-1 text-2xl font-bold">{total}</div>
                  <div className="mt-2"><TierBadge points={total} /></div>
                  <div className="mt-3 text-sm text-slate-600">
                    Max amortization (by tier): <b>{amort} years</b> • Leverage: <b>{(leverage*100).toFixed(0)}%</b>
                  </div>
                </div></div>
              </div>
            </Card>

            <Card title="Quick Loan Illustration">
              <div className="text-sm text-slate-700">
                Example: If project cost/value = <b>$20,000,000</b>, leverage {Math.round(leverage*100)}% → max loan ≈{" "}
                <b>${(maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000)).toLocaleString()}</b>.
                At 4.5% / {amort}y, monthly ≈{" "}
                <b>${Math.round(pmt(4.5, amort, maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000))).toLocaleString()}</b>.
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
