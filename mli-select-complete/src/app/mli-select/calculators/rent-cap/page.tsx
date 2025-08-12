"use client";
import { useMemo, useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { CITIES, MEDIAN_RENTER_INCOME } from "@/lib/data/medianIncome";
import { rentCapFromMedian } from "@/lib/calcs";

export default function RentCapPage() {
  const [city, setCity] = useState("Surrey, BC");
  const [units, setUnits] = useState(100);
  const [affUnitsPlan, setAffUnitsPlan] = useState(25);
  const [projectType, setProjectType] = useState<"new"|"existing">("new");

  const median = MEDIAN_RENTER_INCOME[city] ?? 60000;
  const rentCap = rentCapFromMedian(median);

  const thresholdsNew = [ {pts:50, pct:10}, {pts:70, pct:15}, {pts:100, pct:25} ];
  const thresholdsExist = [ {pts:50, pct:40}, {pts:70, pct:60}, {pts:100, pct:80} ];
  const table = projectType==="new" ? thresholdsNew : thresholdsExist;

  const needed = table.map(t => ({ ...t, units: Math.ceil((t.pct/100) * units) }));

  const qualifies = useMemo(() => {
    const pct = units ? (affUnitsPlan / units) * 100 : 0;
    let level = 0;
    for (let i = table.length-1; i >= 0; i--) { if (pct >= table[i].pct) { level = table[i].pts; break; } }
    return level;
  }, [units, affUnitsPlan, table]);

  return (<>
    <SectionHero title="Affordability Rent Cap" subtitle="Find the affordable rent threshold and units required by tier." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-3">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>City</label>
            <select value={city} onChange={e=>setCity(e.target.value)}>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <label>Project Type</label>
            <select value={projectType} onChange={e=>setProjectType(e.target.value as any)}>
              <option value="new">New Construction</option>
              <option value="existing">Existing Property</option>
            </select>
            <label>Total Units</label>
            <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} />
            <label>Affordable Units in Plan</label>
            <input type="number" value={affUnitsPlan} onChange={e=>setAffUnitsPlan(+e.target.value)} />
          </div>
        </Card>

        <div className="lg:col-span-2 grid gap-6">
          <Card title="Rent Threshold">
            <div className="text-sm text-slate-700">
              Median renter income in <b>{city}</b> ≈ <b>${median.toLocaleString()}</b>/yr → Affordable rent cap ≈{" "}
              <b>${Math.round(rentCap).toLocaleString()}</b> / month (30% of median income).
            </div>
          </Card>

          <Card title="Units Required by Tier">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {needed.map(n => (
                <div key={n.pts} className="card"><div className="card-body">
                  <div className="font-semibold">Tier {n.pts}</div>
                  <div className="mt-1">{n.pct}% of {units} = <b>{n.units}</b> units</div>
                </div></div>
              ))}
            </div>
          </Card>

          <Card title="Your Plan">
            <div className="text-sm text-slate-700">
              You’re planning <b>{affUnitsPlan}</b> affordable units out of {units} ({((affUnitsPlan/units)*100||0).toFixed(1)}%).<br/>
              This currently qualifies for <b>{qualifies || "no"}</b> points in the Affordability outcome.
            </div>
          </Card>
        </div>
      </div>
    </section>
  </>);
}
