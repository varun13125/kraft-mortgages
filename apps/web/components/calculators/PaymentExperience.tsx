"use client";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { CalculatorShell, CalculatorField as Field, ScenarioDownload, cad } from "./CalculatorShell";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { useLiveRates } from "@/lib/useLiveRates";
import { payment, biweeklySavings, balanceAfter } from "@/lib/calc/payment";
import { ratesAsOf, liveRate } from "@/app/(site)/calculators/_lib/liveRateDefaults";

export default function PaymentExperience() {
  const { data, best5YrFixed, best3YrFixed } = useLiveRates();
  const [principal, setPrincipal] = useState(700000);
  const [rate, setRate] = useState(4.39);
  const [edited, setEdited] = useState(false);
  const [years, setYears] = useState(25);
  const [term, setTerm] = useState(60);
  useEffect(() => {
    if (edited) return;
    const raw = new URLSearchParams(window.location.search).get("rate");
    const n = raw?.trim() ? Number(raw) : NaN;
    if (Number.isFinite(n) && n >= 0 && n <= 30) { setRate(n); setEdited(true); }
    else if (best5YrFixed) setRate(best5YrFixed);
  }, [best5YrFixed, edited]);
  const monthly = payment({ principal, annualRatePct: rate, amortYears: years });
  const accelerated = biweeklySavings({ principal, annualRatePct: rate, amortYears: years });
  const end = balanceAfter({ principal, annualRatePct: rate, amortYears: years, monthsElapsed: term });
  const money = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 }).format(n);
  const source = edited ? "Your rate" : liveRate(data, "fixed5Insured") !== undefined ? `5-year insured fixed benchmark · as of ${ratesAsOf(data) ?? "latest feed"}` : "Illustrative rate";
  const notes = "Canadian semi-annual fixed compounding; principal and interest only. Property tax, insurance, condo fees and mortgage insurance premiums are excluded unless included in entered principal. Rates held constant for illustrations, including lifetime accelerated-payment estimates; future renewal rates will differ. Accelerated biweekly = half the monthly payment, 26 times yearly. Variable mortgages and HELOC interest use different conventions and are not modelled. Loan amortization/insurance eligibility is not assessed. Rules reviewed 2026-10-20.";
  const sections = [{ title: "Inputs", rows: [{ label: "Principal", value: cad(principal) }, { label: "Rate / source", value: `${rate}% / ${source}` }, { label: "Amortization / term", value: `${years} years / ${term} months` }] }, { title: "Results", rows: [{ label: "Monthly payment", value: money(monthly) }, { label: "Accelerated biweekly", value: money(accelerated.acceleratedBiweekly) }, { label: "Term interest / ending balance", value: `${cad(end.interestPaid)} / ${cad(end.balance)}` }, { label: "Lifetime interest saved (constant rate)", value: cad(accelerated.totalInterestSaved) }, { label: "Years saved (constant rate)", value: accelerated.yearsSaved.toFixed(1) }] }];
  return <><Navigation /><CalculatorSchema name="Mortgage Payment Calculator" description="Calculate Canadian fixed mortgage payments, term interest, ending balance and accelerated biweekly savings." url="/calculators/payment" />
    <CalculatorShell eyebrow="Mortgage planning" title="A payment you can plan around." description="Understand your monthly payment, the balance at renewal and what accelerated payments could change."
      summary={<><span className="calc-label">Monthly payment</span><strong>{money(monthly)}</strong></>}
      inputs={<><h2>Your mortgage</h2><Field label="Mortgage Principal" value={principal} min={1} onChange={setPrincipal} />
        <Field label="Interest Rate (%)" value={rate} max={30} onChange={n => { setRate(n); setEdited(true); }} hint={source} />
        <div className="calc-filters calc-rate-presets">{[{ label: "5-Yr Fixed", value: best5YrFixed }, { label: "3-Yr Fixed", value: best3YrFixed }].map(p => <button key={p.label} onClick={() => { setRate(p.value); setEdited(true); }}>{p.label}: {p.value.toFixed(2)}%</button>)}</div>
        <p className="calc-caption" style={{ color: "#4d5864", margin: "12px 0 24px" }}>Presets are insured fixed-rate benchmarks. Eligibility, term pricing and your actual offer may differ.</p>
        <Field label="Amortization (Years)" value={years} min={1} max={50} onChange={setYears} />
        <Field label="Term for balance preview (months)" value={term} min={1} max={120} step={1} onChange={n => setTerm(Math.round(n))} />
      </>}
      assumptions={<><p>{notes}</p><p>Payment presets come from the existing Kraft rate feed and never overwrite a manual rate edit. Use your lender’s actual fixed rate. This is an estimate, not a qualification or rate commitment.</p></>}
    ><p className="calc-label">Monthly payment · principal & interest</p><p className="calc-value" data-testid="monthly-payment">{money(monthly)}</p><p className="calc-caption">12 payments each year. Build your full housing budget around taxes, insurance, utilities and a reserve as well.</p>
      <dl className="calc-metrics"><div><dt>Accelerated biweekly</dt><dd>{money(accelerated.acceleratedBiweekly)}</dd></div><div><dt>Interest over {term} months</dt><dd>{cad(end.interestPaid)}</dd></div><div><dt>Balance after {term} months</dt><dd>{cad(end.balance)}</dd></div><div><dt>Principal repaid by that date</dt><dd>{cad(principal - end.balance)}</dd></div></dl>
      <div className="calc-offer"><h3>Accelerated payment illustration</h3><p className="calc-caption">Pay half the monthly amount every two weeks. At a constant {rate}% rate, you could save {cad(accelerated.totalInterestSaved)} in lifetime interest and finish about {accelerated.yearsSaved.toFixed(1)} years earlier.</p></div>
      <p className="calc-notice">Lifetime savings assume the same rate throughout the mortgage. Actual renewal rates, lender rounding and prepayment terms will affect the result.</p>
      <ScenarioDownload title="Mortgage Payment Scenario" sections={sections} notes={notes} />
    </CalculatorShell></>;
}
