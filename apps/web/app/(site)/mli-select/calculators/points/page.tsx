"use client";
import { useState } from "react";
import Card from "@/components/mli/Card";
import TierBadge from "@/components/mli/TierBadge";
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
} from "@/lib/mli/calcs";
import { downloadCSV, downloadJSON } from "@/lib/mli/export";

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
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold-500/5 to-transparent"></div>
          {/* Animated Mesh Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -inset-[10px] opacity-50">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-gold-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
          </div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative z-10 py-20 px-4 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-gradient-to-r from-gold-500/20 to-amber-500/20 border border-gold-500/30 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gold-400 tracking-wide">CMHC • MLI SELECT PROGRAM</span>
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-pulse"></div>
              </div>
              
              {/* Main Title with Gradient */}
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-gray-100 via-gold-200 to-gray-100 bg-clip-text text-transparent">
                  Points & Tier
                </span>
                <br />
                <span className="text-3xl sm:text-4xl text-gray-400 font-normal">
                  Calculator
                </span>
              </h1>
              
              {/* Enhanced Description */}
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Calculate your MLI Select qualification score across 
                <span className="text-gold-400 font-semibold"> Affordability</span>, 
                <span className="text-green-400 font-semibold"> Energy Efficiency</span>, and 
                <span className="text-blue-400 font-semibold"> Accessibility</span> outcomes.
              </p>
              
              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center gap-8 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                    <span className="text-gold-400 font-bold">50</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Tier 1</div>
                    <div className="text-sm text-gray-300">Base Benefits</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <span className="text-blue-400 font-bold">70</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Tier 2</div>
                    <div className="text-sm text-gray-300">Enhanced Terms</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                    <span className="text-green-400 font-bold">100</span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Tier 3</div>
                    <div className="text-sm text-gray-300">Maximum Benefits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            <Card title={
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500/20 to-gold-600/20 rounded-lg flex items-center justify-center border border-gold-500/30">
                  <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span>Project Details</span>
              </div>
            }>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scenario Name</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder-gray-500" 
                    value={name} 
                    onChange={e=>setName(e.target.value)} 
                    placeholder="My scenario" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                  <select 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    value={projectType} 
                    onChange={e=>setProjectType(e.target.value as any)}
                  >
                    <option value="new">New Construction</option>
                    <option value="existing">Existing Property</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Units</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={units} 
                    onChange={e=>setUnits(+e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Affordable Units</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={affUnits} 
                    onChange={e=>setAffUnits(+e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Affordability Commitment (years)</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={affYears} 
                    onChange={e=>setAffYears(+e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Energy Improvement (%)</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={energyPct} 
                    onChange={e=>setEnergyPct(+e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-600 bg-gray-700 text-gold-400"
                      checked={visitAll} 
                      onChange={e=>setVisitAll(e.target.checked)} 
                    />
                    All units visitable
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-600 bg-gray-700 text-gold-400"
                      checked={commons} 
                      onChange={e=>setCommons(e.target.checked)} 
                    />
                    Barrier-free commons
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Fully Accessible Units (% of total)</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={accPct} 
                    onChange={e=>setAccPct(+e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Universal Design Units (% of total)</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={udPct} 
                    onChange={e=>setUdPct(+e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">RHF Accessibility Score</label>
                  <input 
                    className="w-full rounded-lg border border-gray-600 bg-gray-700/50 text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                    type="number" 
                    value={rhf} 
                    onChange={e=>setRhf(+e.target.value)} 
                  />
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button className="px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600" onClick={saveScenario}>Save</button>
                  <button className="px-4 py-2 bg-gold-500 text-gray-900 rounded-lg hover:bg-gold-400 transition-colors font-semibold" onClick={printPDF}>Print / PDF</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600" onClick={exportCSV}>Export CSV</button>
                  <button className="px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600" onClick={exportJSON}>Export JSON</button>
                </div>
              </div>
            </Card>

            <div className="lg:col-span-2 grid gap-6">
              <Card title="Results">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="font-semibold text-gray-100">Affordability</div>
                    <div className="mt-1 text-gray-400">{((affUnits/units)*100||0).toFixed(1)}% units • {affYears} years</div>
                    <div className="mt-1 text-gray-300">Points: <b className="text-gold-400">{aPts}</b></div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="font-semibold text-gray-100">Energy</div>
                    <div className="mt-1 text-gray-400">{energyPct}% improvement</div>
                    <div className="mt-1 text-gray-300">Points: <b className="text-gold-400">{ePts}</b></div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="font-semibold text-gray-100">Accessibility</div>
                    <div className="mt-1 text-gray-400">Points</div>
                    <div className="mt-1 text-gray-300">Points: <b className="text-gold-400">{accPts}</b></div>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                    <div className="font-semibold text-gray-100">Total</div>
                    <div className="mt-1 text-2xl font-bold text-gold-400">{total}</div>
                    <div className="mt-2"><TierBadge points={total} /></div>
                    <div className="mt-3 text-sm text-gray-400">
                      Max amortization (by tier): <b>{amort} years</b> • Leverage: <b>{(leverage*100).toFixed(0)}%</b>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Quick Loan Illustration">
                <div className="text-sm text-gray-300">
                  Example: If project cost/value = <b>$20,000,000</b>, leverage {Math.round(leverage*100)}% → max loan ≈{" "}
                  <b>${(maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000)).toLocaleString()}</b>.
                  At 4.5% / {amort}y, monthly ≈{" "}
                  <b>${Math.round(pmt(4.5, amort, maxLoanFromValueOrCost(projectType==="new", tier, 20_000_000))).toLocaleString()}</b>.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}