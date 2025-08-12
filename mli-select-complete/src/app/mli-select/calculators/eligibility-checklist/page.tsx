"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function EligibilityChecklistPage() {
  const [units, setUnits] = useState(20);
  const [resShare, setResShare] = useState(85);
  const [hasLender, setHasLender] = useState(true);
  const [experience, setExperience] = useState(true);
  const [score50, setScore50] = useState(true);

  const okUnits = units >= 5;
  const okRes = resShare >= 70;
  const likelyEligible = okUnits && okRes && hasLender && experience && score50;

  return (<>
    <SectionHero title="Eligibility Checklist" subtitle="Quick self-check for basic MLI Select requirements." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Checklist">
          <div className="grid gap-3 text-sm">
            <label>Total Units (min 5)</label>
            <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} />
            <label>Residential Share (GFA or value, %)</label>
            <input type="number" value={resShare} onChange={e=>setResShare(+e.target.value)} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={hasLender} onChange={e=>setHasLender(e.target.checked)} />
              Working with an approved lender / broker
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={experience} onChange={e=>setExperience(e.target.checked)} />
              Sponsor has relevant development/asset experience
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={score50} onChange={e=>setScore50(e.target.checked)} />
              Likely to reach at least 50 points (see Points calculator)
            </label>
          </div>
        </Card>
        <Card title="Result">
          <div className={`text-sm ${likelyEligible ? "text-emerald-700" : "text-rose-700"}`}>
            {likelyEligible
              ? "You appear to meet the basic program requirements. Proceed to Points & Tier."
              : "One or more minimum requirements aren’t met yet. Adjust your plan (units, residential share, team, or points)."}
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Note: Final eligibility and underwriting are determined by CMHC via your lender.
          </div>
        </Card>
      </div>
    </section>
  </>);
}
