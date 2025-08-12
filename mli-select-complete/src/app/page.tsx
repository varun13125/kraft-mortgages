import Link from "next/link";
import SectionHero from "@/components/SectionHero";
import { Calculator, BookOpenCheck, ListChecks, BarChartBig } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <SectionHero
        title="MLI Select — Complete Portal"
        subtitle="Everything developers and investors need: deep program guide, rich UI calculators, and a clean application roadmap."
        ctas={[
          { href: "/mli-select/overview", label: "Learn the Program", primary: true },
          { href: "/mli-select/calculators", label: "Use Calculators" }
        ]}
      />

      <section className="section-pad">
        <div className="container-tight grid gap-6 md:grid-cols-3">
          <Link href="/mli-select/overview" className="card">
            <div className="card-body">
              <BookOpenCheck className="h-6 w-6 text-brand-gold" />
              <h3 className="mt-3 text-lg font-semibold">Program Overview</h3>
              <p className="mt-1 text-sm text-slate-600">
                Understand eligibility, scoring, and benefits across tiers (50 / 70 / 100 points).
              </p>
            </div>
          </Link>
          <Link href="/mli-select/calculators" className="card">
            <div className="card-body">
              <Calculator className="h-6 w-6 text-brand-gold" />
              <h3 className="mt-3 text-lg font-semibold">Calculators</h3>
              <p className="mt-1 text-sm text-slate-600">
                Points & tier, rent cap, max loan, DSCR, amortization, premium, break-even, eligibility.
              </p>
            </div>
          </Link>
          <Link href="/mli-select/application-process" className="card">
            <div className="card-body">
              <ListChecks className="h-6 w-6 text-brand-gold" />
              <h3 className="mt-3 text-lg font-semibold">Application Process</h3>
              <p className="mt-1 text-sm text-slate-600">
                Step-by-step guide, documentation checklist, and underwriting timeline.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-tight grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="card-body">
              <BarChartBig className="h-6 w-6 text-brand-gold" />
              <h3 className="mt-3 text-lg font-semibold">Download the MLI Select Guide (PDF)</h3>
              <p className="mt-1 text-sm text-slate-600">
                Informational + promotional guide: scoring, benefits, and why Kraft Mortgages is your partner.
              </p>
              <a href="/guide.pdf" className="btn btn-primary mt-4" download>
                Download Guide
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="text-lg font-semibold">Talk to an MLI Select Specialist</h3>
              <p className="mt-1 text-sm text-slate-600">
                Get a free assessment of your project — we’ll size your deal, optimize points, and map your timeline.
              </p>
              <Link href="/contact" className="btn btn-outline mt-4">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
