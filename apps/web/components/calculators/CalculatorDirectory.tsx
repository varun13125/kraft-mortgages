"use client";
import { useState } from "react";
import Link from "next/link";
import { calculatorCatalog } from "@/lib/calculators/catalog";

const categories = ["All", "Home buying", "Renew & refinance", "Equity & debt", "Rental development", "Commercial", "Construction"];
export default function CalculatorDirectory() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const matches = calculatorCatalog.filter(c => (category === "All" || c.category === category) && `${c.name} ${c.category} ${c.href}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <main id="main-content" className="premium-calculator">
    <header className="calc-intro"><p className="calc-eyebrow">The Kraft calculator collection</p><h1>Clarity for your next move.</h1><p>Start with the decision you need to make. Explore payments, compare renewal offers or size your next rental development.</p></header>
    <div className="calc-featured"><Link href="/calculators/renewal"><span className="calc-label">For homeowners</span><h2>Compare renewal offers</h2><p>See interest, fees, incentives and ending balances together.</p><span className="calc-caption">Compare offers →</span></Link>
      <Link href="/mli-select/calculators/deal-sizer"><span className="calc-label">For rental developers</span><h2>Size an MLI Select deal</h2><p>Connect program points, leverage, premiums, debt coverage and cash.</p><span className="calc-caption">Build a scenario →</span></Link></div>
    <section className="calc-search" aria-label="Find a calculator"><label htmlFor="calculator-search" className="block mb-3">What would you like to calculate?</label><input id="calculator-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try payment, renewal, cash flow or construction" />
      <div className="calc-filters" aria-label="Filter by goal">{categories.map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div></section>
    <p className="calc-caption mb-5" role="status">{matches.length} {matches.length === 1 ? "calculator" : "calculators"}{category !== "All" ? ` · ${category}` : ""}</p>
    <div className="calc-catalog">{matches.map(c => <Link key={c.href} href={c.href}><span className="calc-label">{c.category}</span><h2>{c.name}</h2><p>Open calculator →</p></Link>)}</div>
    {!matches.length && <p className="calc-notice">No calculators match this search. Try a broader term or choose All.</p>}
    <p className="calc-caption mt-8">Estimates support planning. Actual rates, lender policies, qualification and costs depend on your circumstances.</p>
  </main>;
}
