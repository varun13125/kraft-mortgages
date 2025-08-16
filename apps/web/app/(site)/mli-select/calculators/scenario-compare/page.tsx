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
  premiumDiscountFor,
  maxLoanFromValueOrCost,
} from "@/lib/mli/calcs";

type Scenario = {
  id: string;
  name: string;
  projectType: "new" | "existing";
  units: number;
  affUnits: number;
  affYears: number;
  energyPct: number;
  visitAll: boolean;
  commons: boolean;
  accPct: number;
  udPct: number;
  rhf: number;
  valueOrCost: number;
  basePremium: number;
};

const defaultScenario: Omit<Scenario, 'id' | 'name'> = {
  projectType: "new",
  units: 100,
  affUnits: 25,
  affYears: 10,
  energyPct: 25,
  visitAll: true,
  commons: true,
  accPct: 15,
  udPct: 0,
  rhf: 0,
  valueOrCost: 20000000,
  basePremium: 3.85,
};

export default function ScenarioComparePage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: "1", name: "Scenario A", ...defaultScenario },
    { id: "2", name: "Scenario B", ...defaultScenario, affUnits: 40, energyPct: 40 },
  ]);

  const addScenario = () => {
    const newId = (scenarios.length + 1).toString();
    setScenarios(prev => [...prev, {
      id: newId,
      name: `Scenario ${String.fromCharCode(64 + scenarios.length + 1)}`,
      ...defaultScenario
    }]);
  };

  const removeScenario = (id: string) => {
    if (scenarios.length > 1) {
      setScenarios(prev => prev.filter(s => s.id !== id));
    }
  };

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const calculateResults = (scenario: Scenario) => {
    const pctAff = scenario.units ? (scenario.affUnits / scenario.units) * 100 : 0;
    const aPts = affordabilityPoints(scenario.projectType === "new", pctAff, scenario.affYears);
    const ePts = energyPoints(scenario.energyPct);
    const accPts = accessibilityPoints({
      visitableAll: scenario.visitAll,
      commonsBarrierFree: scenario.commons,
      pctAccessible: scenario.accPct,
      pctUniversal: scenario.udPct,
      rhfScore: scenario.rhf
    });
    const total = totalPointsCalc(aPts, ePts, accPts);
    const tier = tierFromPoints(total);
    const amort = amortByTier(tier);
    const leverage = leverageFor(scenario.projectType === "new", tier);
    const discount = premiumDiscountFor(tier);
    const finalPremium = scenario.basePremium * (1 - discount);
    const maxLoan = maxLoanFromValueOrCost(scenario.projectType === "new", tier, scenario.valueOrCost);
    const premiumSavings = scenario.valueOrCost * (scenario.basePremium - finalPremium) / 100;

    return {
      aPts, ePts, accPts, total, tier, amort, leverage, discount, finalPremium, maxLoan, premiumSavings
    };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
            CMHC • MLI Select
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-6">
            Scenario Compare
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Compare multiple MLI Select scenarios side by side to optimize your points and terms.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100">Scenarios</h2>
            <div className="flex gap-3">
              <button 
                onClick={addScenario}
                className="px-4 py-2 bg-gold-500 text-gray-900 rounded-lg hover:bg-gold-400 transition-colors font-semibold"
              >
                Add Scenario
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {scenarios.map(scenario => {
              const results = calculateResults(scenario);
              
              return (
                <Card key={scenario.id} title={
                  <div className="flex items-center justify-between">
                    <input 
                      value={scenario.name}
                      onChange={e => updateScenario(scenario.id, { name: e.target.value })}
                      className="bg-transparent border-none text-lg font-semibold text-gray-100 focus:outline-none focus:ring-2 focus:ring-gold-500/50 rounded px-2"
                    />
                    {scenarios.length > 1 && (
                      <button 
                        onClick={() => removeScenario(scenario.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                }>
                  <div className="space-y-4">
                    {/* Basic Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Project Type</label>
                        <select 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          value={scenario.projectType}
                          onChange={e => updateScenario(scenario.id, { projectType: e.target.value as "new" | "existing" })}
                        >
                          <option value="new">New</option>
                          <option value="existing">Existing</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Total Units</label>
                        <input 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          type="number" 
                          value={scenario.units}
                          onChange={e => updateScenario(scenario.id, { units: +e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Affordable Units</label>
                        <input 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          type="number" 
                          value={scenario.affUnits}
                          onChange={e => updateScenario(scenario.id, { affUnits: +e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Aff. Years</label>
                        <input 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          type="number" 
                          value={scenario.affYears}
                          onChange={e => updateScenario(scenario.id, { affYears: +e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Energy %</label>
                        <input 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          type="number" 
                          value={scenario.energyPct}
                          onChange={e => updateScenario(scenario.id, { energyPct: +e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Accessible %</label>
                        <input 
                          className="w-full text-xs rounded border border-gray-600 bg-gray-700/50 text-gray-100 px-2 py-1 focus:ring-1 focus:ring-gold-500/50"
                          type="number" 
                          value={scenario.accPct}
                          onChange={e => updateScenario(scenario.id, { accPct: +e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-xs text-gray-300">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-600 bg-gray-700 text-gold-400"
                          checked={scenario.visitAll}
                          onChange={e => updateScenario(scenario.id, { visitAll: e.target.checked })}
                        />
                        Visitable
                      </label>
                      <label className="flex items-center gap-1 text-xs text-gray-300">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-600 bg-gray-700 text-gold-400"
                          checked={scenario.commons}
                          onChange={e => updateScenario(scenario.id, { commons: e.target.checked })}
                        />
                        Commons
                      </label>
                    </div>

                    {/* Results */}
                    <div className="border-t border-gray-600 pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Points</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gold-400">{results.total}</span>
                          <TierBadge points={results.total} />
                        </div>
                      </div>
                      
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Affordability:</span>
                          <span className="text-gray-300">{results.aPts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Energy:</span>
                          <span className="text-gray-300">{results.ePts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accessibility:</span>
                          <span className="text-gray-300">{results.accPts}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-600 pt-3 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max Amort:</span>
                          <span className="text-gray-300">{results.amort}y</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Leverage:</span>
                          <span className="text-gray-300">{(results.leverage * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Premium Discount:</span>
                          <span className="text-green-400">{(results.discount * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Comparison Table */}
          {scenarios.length > 1 && (
            <div className="mt-12">
              <Card title="Side-by-Side Comparison">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-gray-300">Metric</th>
                        {scenarios.map(scenario => (
                          <th key={scenario.id} className="text-center py-2 text-gray-100">{scenario.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {[
                        { label: "Total Points", key: "total" },
                        { label: "Tier", key: "tier" },
                        { label: "Max Amortization", key: "amort", suffix: " years" },
                        { label: "Leverage", key: "leverage", multiply: 100, suffix: "%" },
                        { label: "Premium Discount", key: "discount", multiply: 100, suffix: "%" },
                      ].map(metric => (
                        <tr key={metric.label}>
                          <td className="py-2 text-gray-300">{metric.label}</td>
                          {scenarios.map(scenario => {
                            const results = calculateResults(scenario);
                            let value = results[metric.key as keyof typeof results] as number;
                            if (metric.multiply) value *= metric.multiply;
                            const formatted = typeof value === 'number' ? 
                              (metric.multiply ? value.toFixed(0) : value.toString()) : 
                              value;
                            return (
                              <td key={scenario.id} className="text-center py-2 text-gray-100 font-medium">
                                {formatted}{metric.suffix || ""}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}