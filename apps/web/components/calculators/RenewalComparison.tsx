"use client";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { CalculatorShell, CalculatorField as Field, ScenarioDownload, cad } from "./CalculatorShell";
import { CalculatorSchema } from "@/components/SEO/CalculatorSchema";
import { compareRenewal, type RenewalOffer } from "@/lib/calc/renewal";
import { useLiveRates } from "@/lib/useLiveRates";
import { liveRate, useLiveDefault } from "@/app/(site)/calculators/_lib/liveRateDefaults";
import { LiveRateNote } from "@/app/(site)/calculators/_lib/LiveRateNote";

const offer = (name: string, rate: number): RenewalOffer => ({ name, rate, amortYears: 22, termMonths: 60, fees: 0, cashback: 0, clawback: 0 });
export default function RenewalComparison() {
  const [balance, setBalance] = useState(450000);
  const [early, setEarly] = useState(false);
  const [horizon, setHorizon] = useState(60);
  const [penalty, setPenalty] = useState(20000);
  const [baseline, setBaseline] = useState(offer("Your lender", 5.49));
  const [alternatives, setAlternatives] = useState([offer("Offer A", 4.49), { ...offer("Offer B", 4.69), cashback: 1500 }]);
  const { data } = useLiveRates();
  const [benchmark, setBenchmark, rateSource] = useLiveDefault(4.49, liveRate(data, "fixed5Conventional"));
  const offers = [{ ...alternatives[0], rate: benchmark }, alternatives[1]];
  const result = compareRenewal({ principal: balance, baseline, offers, horizonMonths: horizon, earlyBreak: early, penalty });
  const winner = result.results[result.winnerIndex];
  const update = (index: number, key: keyof RenewalOffer, value: number) => {
    if (index === 0) setBaseline(old => ({ ...old, [key]: value }));
    else if (index === 1 && key === "rate") setBenchmark(value);
    else setAlternatives(old => old.map((o, i) => i === index - 1 ? { ...o, [key]: value } : o));
  };
  const sections = [{ title: "Scenario & assumptions", rows: [
    { label: "Balance; all costs paid in cash", value: cad(balance) },
    { label: "Mode", value: early ? "Break early; current rate is baseline" : "At renewal; quoted renewal offer is baseline" },
    { label: "Common comparison period", value: `${result.months} months` },
    { label: "Switching penalty", value: cad(early ? penalty : 0) },
  ] }, ...result.results.map(o => ({ title: o.name, rows: [
    { label: "Rate / amortization / quoted term", value: `${o.rate}% / ${o.amortYears} years / ${o.termMonths} months` },
    { label: "Monthly payment", value: cad(o.monthlyPayment) },
    { label: "Interest / ending balance", value: `${cad(o.interestPaid)} / ${cad(o.balance)}` },
    { label: "Fees / retained cashback / clawback", value: `${cad(o.fees)} / ${cad(o.cashback)} / ${cad(o.clawback)}` },
    { label: "Net interest + cash costs", value: cad(o.netCost) },
    { label: "Saving against your lender", value: cad(o.savings) },
  ] }))];
  const notes = "Canadian semi-annual fixed compounding; monthly payments. Same principal and common horizon; no cash-out, capitalized costs, tax effects or discounting. Net cost = interest + cash fees + applicable penalty + clawback - retained cashback. Rates held constant only within quoted terms. Examples and benchmarks are not lender offers. Rules reviewed 2026-10-20. Confirm the actual payout quote and product restrictions with your lender.";
  return <><Navigation /><CalculatorSchema name="Renewal Offer Comparison" description="Compare mortgage renewal offers, cash costs, interest and ending balances over one common period." url="/calculators/renewal" />
    <CalculatorShell eyebrow="Renewal & switching" title="Put your renewal offers side by side."
      description="Compare your lender’s quote with two alternatives. See payment relief, total interest, cash costs and the balance you will still owe."
      summary={<><span className="calc-label">Lowest cost · {result.months} months</span><strong>{winner.name} · {cad(winner.savings)} saving</strong></>}
      inputs={<><h2>Your comparison</h2>
        <label className="calc-toggle"><input type="checkbox" checked={early} onChange={e => { setEarly(e.target.checked); setBaseline(o => ({ ...o, termMonths: e.target.checked ? 36 : 60 })); }} />I am considering breaking my mortgage before renewal</label>
        <div className="calc-fields"><Field label="Mortgage balance ($)" value={balance} min={1} onChange={setBalance} /><Field label="Compare over (months)" value={horizon} min={1} max={120} step={1} onChange={n => setHorizon(Math.round(n))} /></div>
        {early && <Field label="Actual payout penalty ($)" value={penalty} onChange={setPenalty} hint="Get a dated lender payout quote; do not rely on a generic IRD estimate." />}
        {[baseline, ...offers].map((o, index) => <fieldset key={o.name}><legend>{index === 0 ? early ? "Current mortgage" : "Your lender’s renewal quote" : o.name}</legend>
          <div className="calc-fields"><Field label={`${index === 0 ? early ? "Current" : "Quoted renewal" : o.name} rate (%)`} value={o.rate} max={30} onChange={v => update(index, "rate", v)} />
            <Field label={`${o.name} amortization (years)`} value={o.amortYears} min={1} max={50} onChange={v => update(index, "amortYears", v)} />
            <Field label={`${o.name} ${index === 0 && early ? "remaining term" : "quoted term"} (months)`} value={o.termMonths} min={1} max={120} step={1} onChange={v => update(index, "termMonths", Math.round(v))} />
            <Field label={`${o.name} cash-paid fees ($)`} value={o.fees} onChange={v => update(index, "fees", v)} />
            <Field label={`${o.name} retained cashback ($)`} value={o.cashback} onChange={v => update(index, "cashback", v)} hint="Amount you keep at the comparison date." />
            <Field label={`${o.name} other clawbacks ($)`} value={o.clawback} onChange={v => update(index, "clawback", v)} hint="Exclude amounts already deducted from retained cashback." /></div>
        </fieldset>)}
        <p className="calc-caption" style={{ color: "#4d5864" }}>Offer A starts from a conventional 5-year fixed benchmark. Replace it with your actual quote; other rates are examples.</p><LiveRateNote data={data} product="fixed5Conventional" source={rateSource} className="!text-slate-600 [&_a]:!text-slate-800" />
      </>}
      assumptions={<><p>{notes}</p><p>At renewal, compare the lender’s new offer rather than the expiring contract rate. Early-break mode compares the existing contract only to the end of the shortest term.</p>
        <p>Eligible uninsured straight switches between federally regulated lenders may be exempt from OSFI’s prescribed minimum qualifying rate. Lenders still assess credit and affordability. Increasing the balance or remaining amortization can change treatment. This tool does not confirm eligibility. <a href="https://www.osfi-bsif.gc.ca/en/news/backgrounder-minimum-qualifying-rate-mqr" target="_blank" rel="noreferrer">OSFI source</a>.</p></>}
    >
      <p className="calc-label">Lowest modelled cost · {result.months} months</p><h2 style={{ marginTop: 10 }}>{winner.name} has the lowest cost</h2>
      <p className="calc-value" data-testid="renewal-savings">{cad(winner.savings)}</p><p className="calc-caption">Estimated saving against your lender, after the cash costs entered. Positive savings do not guarantee approval or account for product flexibility.</p>
      {result.capped && <p className="calc-notice">Comparison limited to {result.months} months, the shortest quoted term. Future renewal rates are unknown.</p>}
      {result.results.map((o, index) => <article className="calc-offer" data-best={index === result.winnerIndex} key={o.name}><h3>{o.name}{index === result.winnerIndex ? " · Lowest cost" : ""}</h3>
        <dl className="calc-metrics"><div><dt>Monthly payment</dt><dd>{cad(o.monthlyPayment)}</dd></div><div><dt>Interest over {result.months} months</dt><dd>{cad(o.interestPaid)}</dd></div><div><dt>Net cash costs</dt><dd>{cad(o.cashCosts)}</dd></div><div><dt>Interest + cash costs</dt><dd>{cad(o.netCost)}</dd></div><div><dt>Ending mortgage balance</dt><dd>{cad(o.balance)}</dd></div><div><dt>Saving against your lender</dt><dd>{cad(o.savings)}</dd></div></dl>
        {index > 0 && <p className="calc-caption">Cost recovery: {o.recoveryMonths === null ? "not reached within this period" : o.recoveryMonths === 0 ? "at the start, based on entered incentives" : `month ${o.recoveryMonths}`}. {o.straightSwitchShape ? "Same balance and no amortization increase; ask about straight-switch eligibility." : "Amortization extension or early break: ask about underwriting and qualification."}</p>}
      </article>)}
      <p className="calc-notice">A lower payment can leave more debt outstanding. Compare ending balances as well as cost. Check prepayment rights, portability, collateral charges and cashback conditions.</p>
      <ScenarioDownload title="Renewal Offer Comparison" sections={sections} notes={notes} />
    </CalculatorShell></>;
}
