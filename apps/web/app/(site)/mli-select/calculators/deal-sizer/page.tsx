"use client";
import { useState } from "react";
import { CalculatorShell, CalculatorField as Field, ScenarioDownload, cad } from "@/components/calculators/CalculatorShell";
import { sizeMliDeal, type MliDealInput } from "@/lib/calc/mliDeal";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";

const initial: MliDealInput = { isNew: true, units: 100, affordableUnits: 25, affordabilityYears: 10,
  energyImprovement: 25, accessiblePct: 15, universalPct: 0, visitableAll: true, barrierFreeCommons: true,
  value: 20000000, noi: 1200000, rate: 4.5, amortYears: 50, minDcr: 1.10, closingCosts: 50000, financePremium: true };
export default function DealSizer() {
  const [input, setInput] = useState(initial);
  const set = <K extends keyof MliDealInput>(key: K, value: MliDealInput[K]) => setInput(old => ({ ...old, [key]: value }));
  const r = sizeMliDeal(input);
  const field = (key: keyof MliDealInput, label: string, min = 0, max = 1e9, hint?: string, step: number | "any" = "any") => <Field key={key} label={label} value={input[key] as number} min={min} max={max} step={step} hint={hint} onChange={v => set(key, v)} />;
  const toggle = (key: keyof MliDealInput, label: string) => <label className="calc-toggle" key={key}><input type="checkbox" checked={input[key] as boolean} onChange={e => set(key, e.target.checked)} />{label}</label>;
  const notes = "Planning estimate for standard residential rental projects with at least 5 units. Canadian semi-annual fixed compounding and monthly payments. Annual stabilized NOI is before debt service; lender underwriting can adjust it. Base loan is limited by leverage and DCR; financed insurance premiums consume DCR capacity. Premium includes standard rental base and amortization surcharge, less MLI Select discount. Excludes taxes on premiums, application fees, construction interest/reserves, non-residential and other-shelter surcharges. New construction uses eligible cost; existing uses lender/CMHC accepted value. Maximums are subject to CMHC and lender approval, not commitments. Rules checked 2026-10-20; premium grid effective 2025-07-14.";
  const sections = [{ title: "Project inputs", rows: [
    { label: "Project / units", value: `${input.isNew ? "New construction" : "Existing rental"} / ${input.units}` },
    { label: "Eligible cost or accepted value / annual NOI", value: `${cad(input.value)} / ${cad(input.noi)}` },
    { label: "Affordable units / commitment", value: `${input.affordableUnits} / ${input.affordabilityYears} years` },
    { label: "Energy / accessible / universal (%)", value: `${input.energyImprovement} / ${input.accessiblePct} / ${input.universalPct}` },
    { label: "All units visitable / barrier-free commons", value: `${input.visitableAll ? "Yes" : "No"} / ${input.barrierFreeCommons ? "Yes" : "No"}` },
    { label: "Rate / amortization used / minimum DCR", value: `${input.rate}% / ${r.amort} years / ${input.minDcr}x` },
    { label: "Closing costs / premium treatment", value: `${cad(input.closingCosts)} / ${input.financePremium ? "Financed" : "Cash-paid"}` },
  ] }, { title: "Estimated sizing", rows: [
    { label: "Points / tier", value: `${r.points} / ${r.tier}` },
    { label: "Base loan / total debt", value: `${cad(r.baseLoan)} / ${cad(r.totalDebt)}` },
    { label: "Insurance premium", value: `${cad(r.premium)} (${r.premiumRate.toFixed(3)}%)` },
    { label: "Cash required", value: cad(r.cashRequired) },
    { label: "Monthly debt service / DCR", value: `${cad(r.monthlyPayment)} / ${r.dscr.toFixed(2)}x` },
    { label: "Annual cash flow before tax", value: cad(r.annualCashFlow) },
    { label: "Binding constraint", value: r.binding },
  ] }];
  return <><CalculatorSchema name="MLI Select Deal Sizer" description="Connect MLI Select points, leverage, premiums, debt coverage and cash required in one standard rental scenario." url="/mli-select/calculators/deal-sizer" />
    <CalculatorShell eyebrow="CMHC MLI Select · Standard rental" title="See how your rental project sizes up."
      description="Connect program points, leverage and debt coverage in one place. Understand the loan, insurance premium and cash your project may need."
      summary={<><span className="calc-label">Estimated base loan</span><strong>{r.eligible ? cad(r.baseLoan) : "Review project eligibility"}</strong></>}
      inputs={<><h2>Your rental project</h2>{toggle("isNew", "New construction (uncheck for an existing property)")}
        <div className="calc-fields">{field("value", input.isNew ? "Eligible project cost ($)" : "Accepted property value ($)", 1)}{field("noi", "Annual stabilized NOI ($)", 1, 1e9, "After operating expenses and vacancy; before debt service.")}
          {field("units", "Total rental units", 5, 100000, undefined, 1)}{field("affordableUnits", "Affordable units", 0, 100000, "Rent must meet CMHC’s market-specific threshold.", 1)}
          {field("affordabilityYears", "Affordability commitment (years)", 0, 100, undefined, 1)}{field("energyImprovement", input.isNew ? "Energy improvement vs NECB Tier 1 (%)" : "Energy reduction vs existing baseline (%)", 0, 100, "Use a qualified energy professional’s assessment.")}</div>
        <details><summary>Accessibility commitments</summary><div style={{ marginTop: 16 }}>
          {toggle("visitableAll", "All units meet CMHC visitability requirements")}{toggle("barrierFreeCommons", "Common areas are barrier-free")}
          <div className="calc-fields">{field("accessiblePct", "Accessible units (%)", 0, 100)}{field("universalPct", "Universal design units (%)", 0, 100)}</div></div></details>
        <h3>Financing assumptions</h3><div className="calc-fields">{field("rate", "Quoted fixed rate (%)", 0, 30, "4.5% is an example, not a retail rate or commercial quote.")}{field("amortYears", "Requested amortization (years)", 1, 50)}
          {field("minDcr", "Minimum debt coverage (x)", 1.10, 3, "Standard rental floor 1.10x; lender requirements may be higher.")}{field("closingCosts", "Other closing costs / reserves ($)")}</div>
        {toggle("financePremium", "Add the insurance premium to the mortgage")}
      </>}
      assumptions={<><p>{notes}</p><p>Points are indicative commitments, not a certification. This version supports the NECB Tier 1 energy path and accessible/universal unit criteria. It does not assess RHFAC certification or the alternative NBC energy path; use the dedicated points tool and an advisor for those cases.</p><p>Cash required = cost/value − base loan + entered closing costs + cash-paid premium. Taxes on premiums cannot be inferred from this model; include applicable taxes in closing costs. Sensitivity holds points, value, costs and rate constant unless stated otherwise.</p><p><a href="https://www.cmhc-schl.gc.ca/MLISelect" target="_blank" rel="noreferrer">CMHC MLI Select criteria</a> · <a href="https://assets.cmhc-schl.gc.ca/sites/cmhc/professional/project-funding-and-mortgage-financing/mortgage-loan-insurance/multi-unit-insurance/mliselect/mli-select-multi-unit-fees-and-premiums-at-a-glance-en.pdf?rev=477fd129-abf9-4027-a71a-52bf53e2ee32" target="_blank" rel="noreferrer">CMHC premiums and fees</a></p></>}
    >
      {r.eligible ? <><p className="calc-label">Estimated base loan</p><p className="calc-value" data-testid="mli-base-loan">{cad(r.baseLoan)}</p><p className="calc-caption">{r.binding} limits this scenario. Base loan excludes insurance; financed premiums are included in the payment and DCR below.</p>
        <dl className="calc-metrics"><div><dt>Points / qualifying tier</dt><dd>{r.points} / {r.tier}</dd></div><div><dt>Points: affordability / energy / access</dt><dd>{r.affordable} / {r.energy} / {r.access}</dd></div><div><dt>Amortization used / tier maximum</dt><dd>{r.amort} years / {r.tier === 100 ? 50 : r.tier === 70 ? 45 : 40}</dd></div><div><dt>Base loan leverage limit ({(r.leverage * 100).toFixed(0)}%)</dt><dd>{cad(r.leverageCap)}</dd></div><div><dt>DCR capacity, including financed premium</dt><dd>{cad(r.debtCapacity)}</dd></div><div><dt>Insurance premium ({r.premiumRate.toFixed(3)}%)</dt><dd>{cad(r.premium)}</dd></div><div><dt>Total mortgage debt</dt><dd>{cad(r.totalDebt)}</dd></div><div><dt>Cash required</dt><dd data-testid="mli-cash-required">{cad(r.cashRequired)}</dd></div><div><dt>Monthly debt service</dt><dd>{cad(r.monthlyPayment)}</dd></div><div><dt>Debt coverage</dt><dd>{r.dscr.toFixed(2)}x</dd></div><div><dt>Annual cash flow, before tax</dt><dd>{cad(r.annualCashFlow)}</dd></div></dl>
        {input.amortYears > r.amort && <p className="calc-notice">Requested amortization reduced to the {r.amort}-year tier maximum.</p>}
        <div className="calc-offer"><h3>What changes the loan?</h3><p className="calc-caption">At +1 percentage point in rate: {cad(sizeMliDeal({ ...input, rate: Math.min(30, input.rate + 1) }).baseLoan)} base loan.<br />At 10% lower NOI: {cad(sizeMliDeal({ ...input, noi: input.noi * .9 }).baseLoan)} base loan.</p></div>
        <p className="calc-notice">Planning estimate. Lender valuation, stabilized NOI, affordability covenants, energy/accessibility evidence and other underwriting can reduce proceeds or increase required cash.</p>
        <ScenarioDownload title="MLI Select Deal Sizing" sections={sections} notes={notes} />
      </> : <><h2>Review this scenario</h2>{r.errors.map(error => <p className="calc-notice" key={error}>{error}</p>)}<p className="calc-caption">No MLI Select proceeds are shown until the project meets the model’s eligibility checks.</p></>}
    </CalculatorShell></>;
}
