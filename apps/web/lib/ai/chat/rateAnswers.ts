import type { RateBenchmark, RateOffer, RatesApiResponse } from "../../../types/rates";

type Market = { name: string; provinces: readonly string[] };
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Only simple benchmark questions bypass the model. No underwriting or personal quote. */
export function benchmarkRateAnswer(input: string, rates: RatesApiResponse | null, province?: string, lenders: readonly Market[] = [], now = Date.now()): string | null {
  const text = input.toLowerCase();
  if (!/\b(rate|rates|prime)\b/.test(text) || /\b(qualif|afford|penalty|compare|versus|vs|forecast|predict|history|historical|explain|why|calculate|payment)\w*\b/.test(text)) return null;
  const variable = /\bvariable\b/.test(text), fixed = /\bfixed\b/.test(text);
  if (variable && fixed) return null;
  if (!variable && !fixed && !/\bprime\b/.test(text)) return null;
  const date = rates?.last_synced_utc ? new Date(rates.last_synced_utc) : null;
  if (!rates?.success || !date || !Number.isFinite(date.getTime()) || now - date.getTime() > 7 * 864e5 || date.getTime() > now + 864e5) {
    return "I can’t verify a current benchmark from the rate feed right now. Please [check our dated rates](/rates) or [ask our team](/contact) for current pricing.";
  }
  const asOf = date.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Vancouver" });
  if (!variable && !fixed && !Number.isFinite(rates.prime_rate)) return "I can’t verify lender prime right now. Please [check our rates](/rates).";
  if (!variable && !fixed) return `The rate feed’s **lender prime benchmark is ${rates.prime_rate.toFixed(2)}%**, as of ${asOf}. Banks set their own prime rates; the Bank of Canada sets the policy rate. A mortgage’s discount and payment structure depend on the lender.`;
  // Do not substitute a five-year product for a requested one/three-year variable.
  if (/\b(1|one|2|two|3|three|4|four|7|seven|10|ten)[ -]?(year|yr)\b/.test(text) && (variable || !/\b(3|three)[ -]?(year|yr)\b/.test(text))) return null;
  const threeYear = fixed && /\b(3|three)[ -]?(year|yr)\b/.test(text);
  const family = variable ? rates.benchmarks.variable_5yr : threeYear ? rates.benchmarks.fixed_3yr : rates.benchmarks.fixed_5yr;
  const conventional = /\b(refinanc|rental|investment|uninsured|conventional)\w*\b/.test(text);
  const bucket: RateBenchmark | undefined = conventional ? family?.conventional : family?.insured;
  if (!bucket || !Number.isFinite(bucket.lowest_rate) || bucket.lowest_rate <= 0) return "I don’t have a verified benchmark for that product. Please [check our rates](/rates) or [ask our team](/contact).";
  const offers: RateOffer[] = bucket.top_offers?.length ? bucket.top_offers : [{ lender: bucket.leading_lender, rate: bucket.lowest_rate, product: bucket.product_family, effective_date: bucket.effective_date, spread: bucket.lowest_spread }];
  const market = (offer: RateOffer) => lenders.find(l => normalize(l.name) === normalize(offer.lender) || normalize(l.name).replace(/creditunion$/, "") === normalize(offer.lender).replace(/creditunion$/, ""));
  const permitted = offers.filter(o => Number.isFinite(o.rate) && o.rate > 0 && (!province || market(o)?.provinces.includes(province)));
  const best = [...permitted].sort((a, b) => a.rate - b.rate)[0];
  if (!best) return `The feed’s lowest ${variable ? "variable" : "fixed"} offers are regional; I can’t verify one for ${province} from the listed offers. [Ask our team](/contact) for an eligible quote. Feed checked ${asOf}.`;
  const regionLimited = province && best.rate !== bucket.lowest_rate;
  const scope = regionLimited ? `Lowest listed benchmark among lenders with ${province} coverage` : "Our lowest listed benchmark";
  const product = conventional ? "conventional" : "insured, generally under 20% down";
  const spread = variable && best.spread ? ` (${best.spread.replace(/prime/ig, "lender prime")})` : "";
  return `${scope}: **${threeYear ? "3" : "5"}-year ${variable ? "variable" : "fixed"} from ${best.rate.toFixed(2)}%**${spread} — ${product}.\n\nFeed as of ${asOf}; regional and product restrictions apply. This is a benchmark, not an approval or guaranteed quote.${variable ? " Payments depend on the mortgage’s structure." : ""}\n\n${!province ? "Which province is the property in?" : conventional ? "Is this a renewal or refinance?" : "What down payment are you planning?"}`;
}
