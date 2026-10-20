"use client";
import Link from "next/link";
import { useId, type ReactNode } from "react";
import CalculatorNumberInput from "@/components/ui/CalculatorNumberInput";
import { useAdvisorHelp } from "@/components/AdvisorHelp";
import type { ReportSection } from "@/components/calculator-report/generateGenericReport";
import { useState } from "react";

export const cad = (n: number) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(n);
export function CalculatorField({ label, value, onChange, min = 0, max = 1e9, step = "any", hint }: {
  label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number | "any"; hint?: string;
}) {
  const id = useId();
  return <div className="calc-field"><label htmlFor={id}>{label}</label>
    <CalculatorNumberInput id={id} aria-label={label} value={value} min={min} max={max} step={step} aria-describedby={hint ? `${id}-hint` : undefined} onChange={e => onChange(Number(e.target.value))} />
    {hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function CalculatorShell({ eyebrow, title, description, inputs, children, assumptions, summary }: {
  eyebrow: string; title: string; description: string; inputs: ReactNode; children: ReactNode; assumptions: ReactNode; summary?: ReactNode;
}) {
  const { setPanel } = useAdvisorHelp();
  return <main id="main-content" className="premium-calculator">
    <header className="calc-intro"><Link href="/calculators">All calculators</Link><p className="calc-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>
    {summary && <div className="calc-mobile-summary" aria-label="Result summary">{summary}<a href="#scenario-results">View full results ↓</a></div>}
    <div className="calc-workspace"><section className="calc-inputs" aria-label="Scenario inputs">{inputs}</section><section id="scenario-results" className="calc-results" aria-label="Scenario results">{children}</section></div>
    <details className="calc-assumptions"><summary>Assumptions, sources & limitations</summary><div>{assumptions}</div></details>
    <div className="calc-next"><div><h2>A clearer decision starts with the details.</h2><p>Have an advisor review your quotes and the assumptions behind this estimate.</p></div><button className="calc-button" onClick={() => setPanel("menu")}>Discuss this scenario</button></div>
  </main>;
}

/** Ungated, local PDF export. Does not collect contact details or submit a lead. */
export function ScenarioDownload({ title, sections, notes }: { title: string; sections: ReportSection[]; notes: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return <><button className="calc-button calc-button-secondary" disabled={busy} onClick={async () => {
    setBusy(true); setError("");
    try { const { generateGenericReport } = await import("@/components/calculator-report/generateGenericReport");
      generateGenericReport({ title, calculatorName: title, userName: "Your scenario", sections, educationalContent: notes });
    } catch { setError("The PDF could not be created. Please try again."); } finally { setBusy(false); }
  }}>{busy ? "Preparing PDF…" : "Download scenario PDF"}</button>{error && <p role="status">{error}</p>}</>;
}
