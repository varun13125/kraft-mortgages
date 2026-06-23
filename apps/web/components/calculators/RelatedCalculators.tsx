import Link from "next/link";

const CALCULATOR_MAP: Record<string, string> = {
  "payment": "Payment Calculator",
  "affordability": "Affordability Calculator",
  "pre-approval": "Pre-Approval Calculator",
  "renewal": "Renewal Calculator",
  "investment": "Investment Calculator",
  "self-employed": "Self-Employed Calculator",
  "construction-pro": "Construction Pro Calculator",
  "mortgage-penalty": "Mortgage Penalty Calculator",
  "closing-costs": "Closing Costs Calculator",
  "first-time-home-buyer": "First-Time Home Buyer Calculator",
  "land-transfer-tax": "Land Transfer Tax Calculator",
  "stress-test": "Stress Test Calculator",
  "amortization": "Amortization Schedule",
  "bc-speculation-tax": "BC Speculation Tax",
  "debt-service-ratio": "Debt Service Ratio",
  "extra-payments": "Extra Payments Calculator",
  "rate-comparison": "Rate Comparison",
  "rent-vs-buy": "Rent vs Buy",
  "refinance-break-even": "Refinance Break-Even",
  "self-employed-a-vs-b": "Self-Employed A vs B",
  "a-vs-equity": "A vs Equity Lending",
  "b-vs-equity": "B vs Equity Lending",
  "refinance-vs-heloc-vs-second": "Refinance vs HELOC vs 2nd",
  "cmhc-insurance": "CMHC Insurance",
  "down-payment": "Down Payment Calculator",
  "required-income": "Required Income Calculator",
};

/**
 * Renders related calculator links at the bottom of a calculator page.
 * Improves internal linking (SEO) and keeps users exploring.
 */
export function RelatedCalculators({ current, related }: { current: string; related: string[] }) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-700/50">
      <div className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Related Calculators</div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {related.map((slug) => {
          if (slug === current) return null;
          const name = CALCULATOR_MAP[slug] || slug;
          return (
            <Link
              key={slug}
              href={`/calculators/${slug}`}
              className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-700 bg-gray-800/40 text-xs sm:text-sm text-gray-300 hover:border-gold-500/50 hover:text-gold-400 transition-all whitespace-nowrap"
            >
              {name}
            </Link>
          );
        })}
        <Link
          href="/calculators"
          className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-700 bg-gray-800/40 text-xs sm:text-sm text-gray-300 hover:border-gold-500/50 hover:text-gold-400 transition-all whitespace-nowrap"
        >
          All Calculators
        </Link>
      </div>
    </div>
  );
}
