"use client";
import { useEffect, useMemo, useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { downloadCSV, downloadJSON } from "@/lib/export";

type Scenario = {
  name: string;
  projectType: "new"|"existing";
  units: number;
  affUnits: number;
  affYears: number;
  energyPct: number;
  visitAll: boolean;
  commons: boolean;
  accPct: number;
  udPct: number;
  rhf: number;
  points: {
    affordability: number;
    energy: number;
    accessibility: number;
    total: number;
    tier: number;
    amort: number;
    leverage: number;
  };
  savedAt: string;
};

export default function ScenarioComparePage() {
  const [rows, setRows] = useState<Scenario[]>([]);

  useEffect(() => {
    const key = "mli:scenarios";
    try { setRows(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setRows([]); }
  }, []);

  function exportAllCSV() {
    const flat = rows.map(r => ({
      name: r.name,
      projectType: r.projectType,
      units: r.units,
      affUnits: r.affUnits,
      affYears: r.affYears,
      energyPct: r.energyPct,
      accPct: r.accPct,
      udPct: r.udPct,
      rhf: r.rhf,
      aPts: r.points.affordability,
      ePts: r.points.energy,
      accPts: r.points.accessibility,
      total: r.points.total,
      tier: r.points.tier,
      amort: r.points.amort,
      leverage: r.points.leverage,
      savedAt: r.savedAt
    }));
    downloadCSV("mli_scenarios.csv", flat);
  }

  function exportAllJSON() {
    downloadJSON("mli_scenarios.json", rows);
  }

  function clearAll() {
    localStorage.removeItem("mli:scenarios");
    setRows([]);
  }

  return (<>
    <SectionHero title="Scenario Compare" subtitle="Review, export, and manage your saved Points & Tier scenarios." />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card title="Saved Scenarios">
          {rows.length === 0 ? (
            <div className="text-sm text-slate-600">No scenarios saved yet. Save from the Points & Tier calculator.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Type</th>
                    <th className="py-2 pr-4">Units</th>
                    <th className="py-2 pr-4">Aff%</th>
                    <th className="py-2 pr-4">Energy%</th>
                    <th className="py-2 pr-4">Pts (A/E/Acc)</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2 pr-4">Tier</th>
                    <th className="py-2 pr-4">Amort</th>
                    <th className="py-2 pr-4">Leverage</th>
                    <th className="py-2 pr-4">Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 pr-4">{r.name}</td>
                      <td className="py-2 pr-4">{r.projectType}</td>
                      <td className="py-2 pr-4">{r.units}</td>
                      <td className="py-2 pr-4">{((r.affUnits/r.units)*100||0).toFixed(1)}%</td>
                      <td className="py-2 pr-4">{r.energyPct}%</td>
                      <td className="py-2 pr-4">{r.points.affordability}/{r.points.energy}/{r.points.accessibility}</td>
                      <td className="py-2 pr-4 font-semibold">{r.points.total}</td>
                      <td className="py-2 pr-4">{r.points.tier || "—"}</td>
                      <td className="py-2 pr-4">{r.points.amort}y</td>
                      <td className="py-2 pr-4">{Math.round(r.points.leverage*100)}%</td>
                      <td className="py-2 pr-4">{new Date(r.savedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            <button className="btn btn-outline" onClick={exportAllCSV} disabled={rows.length===0}>Export CSV</button>
            <button className="btn btn-outline" onClick={exportAllJSON} disabled={rows.length===0}>Export JSON</button>
            <button className="btn btn-primary" onClick={clearAll} disabled={rows.length===0}>Clear All</button>
          </div>
        </Card>
      </div>
    </section>
  </>);
}
