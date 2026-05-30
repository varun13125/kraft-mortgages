'use client';

import React, { useState, useMemo } from 'react';

interface MliScoreState {
  affordabilityUnits: number;
  energyImprovementPct: number;
  accessibleUnitsPct: number;
}

export const MliSelectCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<MliScoreState>({
    affordabilityUnits: 0,
    energyImprovementPct: 0,
    accessibleUnitsPct: 0
  });

  const mliPoints = useMemo<number>(() => {
    // CMHC Point Scoring Matrix Evaluation Framework
    let score = 0;
    if (inputs.affordabilityUnits >= 40) score += 50;
    else if (inputs.affordabilityUnits >= 20) score += 30;

    if (inputs.energyImprovementPct >= 40) score += 50;
    else if (inputs.energyImprovementPct >= 25) score += 35;

    if (inputs.accessibleUnitsPct >= 20) score += 30;
    else if (inputs.accessibleUnitsPct >= 10) score += 15;

    return Math.min(score, 100);
  }, [inputs]);

  const authorizationTier = useMemo(() => {
    // Evaluates constraints against raw criteria floors (Item 3)
    if (mliPoints >= 100) return { ltvCeiling: 95, amortizationMax: 50, status: 'Tier 1 Eligibility Granted', allowed: true };
    if (mliPoints >= 70) return { ltvCeiling: 92.5, amortizationMax: 45, status: 'Tier 2 Eligibility Granted', allowed: true };
    if (mliPoints >= 50) return { ltvCeiling: 90, amortizationMax: 40, status: 'Tier 3 Eligibility Granted', allowed: true };
    
    return { ltvCeiling: 85, amortizationMax: 35, status: 'NOT ELIGIBLE FOR PREMIUM MLI SELECT LEVERAGE', allowed: false };
  }, [mliPoints]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-2 text-blue-400">CMHC MLI Select Strategic Underwriting Engine</h2>
      <p className="text-xs text-slate-400 mb-4">Validates dynamic scoring boundaries before outputting debt assumptions.</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Affordable Units Allocation (%)</label>
          <input 
            type="number" 
            value={inputs.affordabilityUnits} 
            onChange={(e) => setInputs({...inputs, affordabilityUnits: Math.max(0, parseInt(e.target.value) || 0)})}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Energy Efficiency Target Improvement (%)</label>
          <input 
            type="number" 
            value={inputs.energyImprovementPct} 
            onChange={(e) => setInputs({...inputs, energyImprovementPct: Math.max(0, parseInt(e.target.value) || 0)})}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Barrier-Free Accessible Units (%)</label>
          <input 
            type="number" 
            value={inputs.accessibleUnitsPct} 
            onChange={(e) => setInputs({...inputs, accessibleUnitsPct: Math.max(0, parseInt(e.target.value) || 0)})}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-white"
          />
        </div>
      </div>

      <div className={`p-4 rounded-lg border ${authorizationTier.allowed ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200' : 'bg-amber-950/40 border-amber-800 text-amber-200'}`}>
        <span className="text-xs font-bold block tracking-wider uppercase opacity-75">Status Matrix Flag</span>
        <span className="text-md font-bold">{authorizationTier.status}</span>
        
        <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-sm text-white">
          <div>Calculated Score: <span className="font-bold text-blue-400">{mliPoints} Pts</span></div>
          <div>Max Allowed LTV: <span className="font-bold text-blue-400">{authorizationTier.ltvCeiling}%</span></div>
          <div className="col-span-2">Max Extended Amortization Curve: <span className="font-bold text-blue-400">{authorizationTier.amortizationMax} Years</span></div>
        </div>
      </div>
    </div>
  );
};
