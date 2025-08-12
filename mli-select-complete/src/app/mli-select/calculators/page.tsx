import SectionHero from "@/components/SectionHero";

export default function Page() {
  const items = [
    ["Points & Tier", "/mli-select/calculators/points"],
    ["Affordability Rent Cap", "/mli-select/calculators/rent-cap"],
    ["Max Loan / Equity", "/mli-select/calculators/max-loan"],
    ["DSCR Max Loan", "/mli-select/calculators/dscr"],
    ["Amortization", "/mli-select/calculators/amortization"],
    ["Premium", "/mli-select/calculators/premium"],
    ["Break-Even Rent", "/mli-select/calculators/break-even"],
    ["Eligibility Checklist", "/mli-select/calculators/eligibility-checklist"],
    ["Scenario Compare", "/mli-select/calculators/scenario-compare"]
  ] as const;

  return (<>
    <SectionHero title="MLI Select Calculators" subtitle="Plan points, leverage, amortization, premiums, cash flow — all in one place." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([label, href]) => (
          <a key={href} className="card" href={href}>
            <div className="card-body">
              <div className="text-lg font-semibold">{label}</div>
              <div className="text-sm text-slate-600 mt-1">Open calculator</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  </>);
}
