import fs from 'fs';
import path from 'path';
import type {
  RateOffer,
  RawRatesFeed,
  RateBenchmark,
  RateCardItem,
  RatesApiResponse,
} from '@/types/rates';

// Canonical Verified Fallback Snapshot (Bank of Canada Prime = 4.45%)
const VERIFIED_SNAPSHOT: RawRatesFeed = {
  last_synced_utc: '2026-10-05T13:31:10.407257+00:00',
  prime_rate_benchmark: 4.45,
  rate_benchmarks: {
    '5_year_fixed_insured': {
      lowest_rate: 4.39,
      lowest_spread: 'Fixed',
      leading_lender: 'First National',
      product_family: 'Insured (<20% Down)',
      effective_date: '2026-10-05',
    },
    '5_year_fixed_insurable': {
      lowest_rate: 4.44,
      lowest_spread: 'Fixed',
      leading_lender: 'First National',
      product_family: 'Insurable (20%+ Down)',
      effective_date: '2026-10-05',
    },
    '5_year_fixed_conventional': {
      lowest_rate: 4.39,
      lowest_spread: 'Fixed',
      leading_lender: 'Shinhan Bank Canada',
      product_family: 'Conventional (30-Yr Amort)',
      effective_date: '2026-10-05',
    },
    '3_year_fixed_insured': {
      lowest_rate: 4.34,
      lowest_spread: 'Fixed',
      leading_lender: 'Community Savings Credit Union',
      product_family: 'Insured (<20% Down)',
      effective_date: '2026-09-16',
    },
    '3_year_fixed_insurable': {
      lowest_rate: 4.44,
      lowest_spread: 'Fixed',
      leading_lender: 'Peoples Bank',
      product_family: 'Insurable (20%+ Down)',
      effective_date: '2026-09-25',
    },
    '3_year_fixed_conventional': {
      lowest_rate: 4.49,
      lowest_spread: 'Fixed',
      leading_lender: 'Community Savings Credit Union',
      product_family: 'Conventional (30-Yr Amort)',
      effective_date: '2026-09-16',
    },
    '5_year_variable_insured': {
      lowest_rate: 3.44,
      lowest_spread: 'Prime - 1.01%',
      leading_lender: 'Meridian',
      product_family: 'Insured (<20% Down)',
      effective_date: '2026-09-17',
    },
    '5_year_variable_insurable': {
      lowest_rate: 3.55,
      lowest_spread: 'Prime - 0.90%',
      leading_lender: 'UnionLink / Home Trust',
      product_family: 'Insurable (20%+ Down)',
      effective_date: '2026-09-29',
    },
    '5_year_variable_conventional': {
      lowest_rate: 3.65,
      lowest_spread: 'Prime - 0.80%',
      leading_lender: 'Scotiabank',
      product_family: 'Conventional (30-Yr Amort)',
      effective_date: '2026-09-23',
    },
    '3_year_variable': {
      lowest_rate: 3.55,
      lowest_spread: 'Prime - 0.90%',
      leading_lender: 'Radius Financial',
      product_family: 'Insured ARM',
      effective_date: '2026-09-23',
    },
    '2_year_fixed': {
      lowest_rate: 4.34,
      lowest_spread: 'Fixed',
      leading_lender: 'SERVUS Credit Union',
      product_family: 'Insured',
      effective_date: '2026-09-17',
    },
    '1_year_fixed': {
      lowest_rate: 4.19,
      lowest_spread: 'Fixed',
      leading_lender: 'DUCA',
      product_family: 'Conventional',
      effective_date: '2026-09-18',
    },
    'heloc': {
      lowest_rate: 4.95,
      lowest_spread: 'Fixed Promo',
      leading_lender: 'Coast Capital Savings',
      product_family: 'HELOC (1st Position)',
      effective_date: '2026-09-21',
    },
    'private_second': {
      lowest_rate: 7.99,
      lowest_spread: 'From 7.99%',
      leading_lender: 'Armada Mortgage',
      product_family: 'Private 2nd Mortgage',
      effective_date: '2026-09-20',
      top_offers: [
        {
          lender: 'Armada Mortgage',
          rate: 7.99,
          product: '2nd Mtg <50% LTV Closed',
          spread: '2% lender fee',
          effective_date: '2026-09-20',
        },
        {
          lender: 'AW Capital',
          rate: 8.99,
          product: 'Second Mortgage',
          spread: 'LTV up to 80%',
          effective_date: '2026-09-25',
        },
        {
          lender: 'Alta West Capital',
          rate: 9.49,
          product: 'Flex 2nd Mortgage Promo',
          spread: '',
          effective_date: '2026-09-24',
        },
      ],
    },
  },
};

/**
 * Attempt to load rates JSON from various physical paths or fallbacks.
 */
export function readRawRatesFeed(): { feed: RawRatesFeed; source: string } {
  // BUG-050: only the explicit override and repo-relative paths. The old list
  // also probed a developer's Windows path, sibling "Hermes Agent" folders and
  // /root/kraft-ops on whatever machine ran the code. For local development
  // against the Hermes Agent output, set RATES_DATA_PATH to that file.
  const candidatePaths = [
    process.env.RATES_DATA_PATH,
    path.resolve(process.cwd(), 'data/current_rates.json'), // cwd = apps/web (next dev/start, Vercel)
    path.resolve(process.cwd(), 'apps/web/data/current_rates.json'), // cwd = repo root
  ].filter(Boolean) as string[];

  for (const candidate of candidatePaths) {
    try {
      if (fs.existsSync(candidate)) {
        const fileContent = fs.readFileSync(candidate, 'utf-8');
        const parsed = JSON.parse(fileContent) as RawRatesFeed;
        if (parsed && parsed.rate_benchmarks) {
          return { feed: parsed, source: candidate };
        }
      }
    } catch {
      // Continue to next candidate
    }
  }

  return { feed: VERIFIED_SNAPSHOT, source: 'embedded_verified_snapshot' };
}

/**
 * The Spotlight feed sometimes carries spreadsheet serial dates ("46301") instead of
 * ISO dates. Convert those (days since 1899-12-30) to YYYY-MM-DD; pass anything else through.
 */
export function normalizeEffectiveDate(value: unknown): string {
  const s = value === undefined || value === null ? '' : String(value).trim();
  if (/^\d{5}(\.\d+)?$/.test(s)) {
    const serial = Number(s);
    if (serial > 20000 && serial < 80000) {
      const ms = Date.UTC(1899, 11, 30) + Math.floor(serial) * 86400000;
      return new Date(ms).toISOString().slice(0, 10);
    }
  }
  return s;
}

/**
 * Format raw rate benchmark safely with a fallback.
 * `minPlausibleRate` drops offers below a sanity floor (e.g. A-lender products mislabelled
 * as private seconds at Prime + 0.50%) and recomputes the lowest rate from what remains.
 */
function normalizeBenchmark(
  raw: RateBenchmark | undefined,
  fallback: RateBenchmark,
  minPlausibleRate?: number
): RateBenchmark {
  if (!raw || typeof raw.lowest_rate !== 'number') {
    return fallback;
  }
  let offers = (raw.top_offers || []).map((o) => ({ ...o, effective_date: normalizeEffectiveDate(o.effective_date) }));
  let lowestRate = Number(raw.lowest_rate);
  let leadingLender = raw.leading_lender;
  let lowestSpread = raw.lowest_spread;
  if (minPlausibleRate !== undefined) {
    offers = offers.filter((o) => typeof o.rate === 'number' && o.rate >= minPlausibleRate);
    if (lowestRate < minPlausibleRate) {
      const best = [...offers].sort((a, b) => a.rate - b.rate)[0];
      if (!best) return fallback;
      lowestRate = best.rate;
      leadingLender = best.lender;
      lowestSpread = best.spread || '';
    }
  }
  return {
    lowest_rate: lowestRate,
    lowest_spread: lowestSpread || fallback.lowest_spread || 'Fixed',
    leading_lender: leadingLender || fallback.leading_lender,
    product_family: raw.product_family || fallback.product_family,
    effective_date: normalizeEffectiveDate(raw.effective_date) || fallback.effective_date,
    top_offers: offers.length ? offers : fallback.top_offers,
    ...(typeof raw.median_rate === 'number' ? { median_rate: raw.median_rate } : {}),
    ...(typeof raw.lender_count === 'number' ? { lender_count: raw.lender_count } : {}),
    ...(typeof raw.product_count === 'number' ? { product_count: raw.product_count } : {}),
    ...(raw.typical_lender_fee_pct !== undefined ? { typical_lender_fee_pct: raw.typical_lender_fee_pct } : {}),
  };
}

/**
 * Compute whether date is today in Canadian timezones (UTC / EST / PST).
 */
function isDateToday(isoString: string): boolean {
  try {
    const syncDate = new Date(isoString);
    const now = new Date();
    return (
      syncDate.getUTCFullYear() === now.getUTCFullYear() &&
      syncDate.getUTCMonth() === now.getUTCMonth() &&
      syncDate.getUTCDate() === now.getUTCDate()
    );
  } catch {
    return false;
  }
}

/**
 * Main public formatter returning structured, verified mortgage rates intelligence.
 */
export function formatLiveRatesData(feed: RawRatesFeed, source: string): RatesApiResponse {
  const rb = feed.rate_benchmarks || {};
  const fb = VERIFIED_SNAPSHOT.rate_benchmarks;
  const prime = feed.prime_rate_benchmark || 4.45;

  const f5Insured = normalizeBenchmark(rb['5_year_fixed_insured'], fb['5_year_fixed_insured']!);
  const f5Insurable = normalizeBenchmark(rb['5_year_fixed_insurable'], fb['5_year_fixed_insurable']!);
  const f5Conventional = normalizeBenchmark(rb['5_year_fixed_conventional'], fb['5_year_fixed_conventional']!);

  const f3Insured = normalizeBenchmark(rb['3_year_fixed_insured'], fb['3_year_fixed_insured']!);
  const f3Insurable = normalizeBenchmark(rb['3_year_fixed_insurable'], fb['3_year_fixed_insurable']!);
  const f3Conventional = normalizeBenchmark(rb['3_year_fixed_conventional'], fb['3_year_fixed_conventional']!);

  const v5Insured = normalizeBenchmark(rb['5_year_variable_insured'], fb['5_year_variable_insured']!);
  const v5Insurable = normalizeBenchmark(rb['5_year_variable_insurable'], fb['5_year_variable_insurable']!);
  const v5Conventional = normalizeBenchmark(rb['5_year_variable_conventional'], fb['5_year_variable_conventional']!);

  const heloc = normalizeBenchmark(rb['heloc'], fb['heloc']!);
  // Private seconds price well above prime; anything under Prime + 2% is a mislabelled A-lender product.
  const privateSecond = normalizeBenchmark(rb['private_second'], fb['private_second']!, prime + 2);
  const f2 = normalizeBenchmark(rb['2_year_fixed'], fb['2_year_fixed']!);
  const f1 = normalizeBenchmark(rb['1_year_fixed'], fb['1_year_fixed']!);
  const v3 = normalizeBenchmark(rb['3_year_variable'], fb['3_year_variable']!);

  // A feed without a sync timestamp must not be presented as "today's" rates.
  const lastSynced = feed.last_synced_utc || VERIFIED_SNAPSHOT.last_synced_utc || new Date(0).toISOString();
  const isToday = feed.last_synced_utc ? isDateToday(lastSynced) : false;
  const lastUpdatedHuman = isToday
    ? 'Updated Today'
    : `Updated ${new Date(lastSynced).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Vancouver' })}`;
  // Don't expose server filesystem paths (e.g. /var/task/...) in the public API.
  const publicSource = /^https?:\/\//i.test(source)
    ? source
    : source === 'embedded_verified_snapshot'
      ? source
      : 'local_rates_file';

  const formatRate = (r: number) => `From ${r.toFixed(2)}%`;
  const formatSpread = (spread: string, rate: number, isVar: boolean) => {
    if (spread && spread.toLowerCase().includes('prime')) return spread;
    if (isVar) {
      const diff = rate - prime;
      const sign = diff >= 0 ? '+' : '-';
      return `Prime ${sign} ${Math.abs(diff).toFixed(2)}%`;
    }
    return 'Fixed';
  };

  const featuredRates: RateCardItem[] = [
    {
      id: '5yr-fixed-insured',
      term: '5-Year Fixed',
      category: 'fixed',
      structure: 'Insured (<20% Down)',
      rate: f5Insured.lowest_rate,
      startingRate: formatRate(f5Insured.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f5Insured.leading_lender,
      effectiveDate: f5Insured.effective_date,
      badge: 'Best Value',
      featured: true,
    },
    {
      id: '3yr-fixed-insured',
      term: '3-Year Fixed',
      category: 'fixed',
      structure: 'Insured (<20% Down)',
      rate: f3Insured.lowest_rate,
      startingRate: formatRate(f3Insured.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f3Insured.leading_lender,
      effectiveDate: f3Insured.effective_date,
      badge: 'Most Popular',
      featured: true,
    },
    {
      id: '5yr-variable-insured',
      term: '5-Year Variable ARM',
      category: 'variable',
      structure: 'Insured (<20% Down)',
      rate: v5Insured.lowest_rate,
      startingRate: formatRate(v5Insured.lowest_rate),
      spreadFormula: formatSpread(v5Insured.lowest_spread, v5Insured.lowest_rate, true),
      leadingLender: v5Insured.leading_lender,
      effectiveDate: v5Insured.effective_date,
      badge: 'Lowest Rate',
      featured: true,
    },
    {
      id: 'heloc-first',
      term: 'HELOC',
      category: 'heloc',
      structure: '1st Position Line of Credit',
      rate: heloc.lowest_rate,
      startingRate: formatRate(heloc.lowest_rate),
      spreadFormula: 'Revolving',
      leadingLender: heloc.leading_lender,
      effectiveDate: heloc.effective_date,
      badge: 'Flexible Equity',
      featured: true,
    },
    {
      id: 'private-second',
      term: 'Private 2nd',
      category: 'private',
      structure: 'Second Mortgage (Up to 80% LTV)',
      rate: privateSecond.lowest_rate,
      startingRate: formatRate(privateSecond.lowest_rate),
      spreadFormula: 'Fast Approval (24h)',
      leadingLender: privateSecond.leading_lender,
      effectiveDate: privateSecond.effective_date,
      badge: 'Alternative / Equity',
      featured: true,
    },
  ];

  const allRates: RateCardItem[] = [
    ...featuredRates,
    {
      id: '5yr-fixed-insurable',
      term: '5-Year Fixed',
      category: 'fixed',
      structure: 'Insurable (20%+ Down)',
      rate: f5Insurable.lowest_rate,
      startingRate: formatRate(f5Insurable.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f5Insurable.leading_lender,
      effectiveDate: f5Insurable.effective_date,
    },
    {
      id: '5yr-fixed-conventional',
      term: '5-Year Fixed',
      category: 'fixed',
      structure: 'Conventional (30-Yr Amort)',
      rate: f5Conventional.lowest_rate,
      startingRate: formatRate(f5Conventional.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f5Conventional.leading_lender,
      effectiveDate: f5Conventional.effective_date,
    },
    {
      id: '3yr-fixed-insurable',
      term: '3-Year Fixed',
      category: 'fixed',
      structure: 'Insurable (20%+ Down)',
      rate: f3Insurable.lowest_rate,
      startingRate: formatRate(f3Insurable.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f3Insurable.leading_lender,
      effectiveDate: f3Insurable.effective_date,
    },
    {
      id: '3yr-fixed-conventional',
      term: '3-Year Fixed',
      category: 'fixed',
      structure: 'Conventional (30-Yr Amort)',
      rate: f3Conventional.lowest_rate,
      startingRate: formatRate(f3Conventional.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f3Conventional.leading_lender,
      effectiveDate: f3Conventional.effective_date,
    },
    {
      id: '5yr-variable-insurable',
      term: '5-Year Variable ARM',
      category: 'variable',
      structure: 'Insurable (20%+ Down)',
      rate: v5Insurable.lowest_rate,
      startingRate: formatRate(v5Insurable.lowest_rate),
      spreadFormula: formatSpread(v5Insurable.lowest_spread, v5Insurable.lowest_rate, true),
      leadingLender: v5Insurable.leading_lender,
      effectiveDate: v5Insurable.effective_date,
    },
    {
      id: '5yr-variable-conventional',
      term: '5-Year Variable ARM',
      category: 'variable',
      structure: 'Conventional (30-Yr Amort)',
      rate: v5Conventional.lowest_rate,
      startingRate: formatRate(v5Conventional.lowest_rate),
      spreadFormula: formatSpread(v5Conventional.lowest_spread, v5Conventional.lowest_rate, true),
      leadingLender: v5Conventional.leading_lender,
      effectiveDate: v5Conventional.effective_date,
    },
    {
      id: '3yr-variable',
      term: '3-Year Variable ARM',
      category: 'variable',
      structure: 'Insured ARM',
      rate: v3.lowest_rate,
      startingRate: formatRate(v3.lowest_rate),
      spreadFormula: formatSpread(v3.lowest_spread, v3.lowest_rate, true),
      leadingLender: v3.leading_lender,
      effectiveDate: v3.effective_date,
    },
    {
      id: '2yr-fixed',
      term: '2-Year Fixed',
      category: 'fixed',
      structure: 'Insured',
      rate: f2.lowest_rate,
      startingRate: formatRate(f2.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f2.leading_lender,
      effectiveDate: f2.effective_date,
    },
    {
      id: '1yr-fixed',
      term: '1-Year Fixed',
      category: 'fixed',
      structure: 'Conventional',
      rate: f1.lowest_rate,
      startingRate: formatRate(f1.lowest_rate),
      spreadFormula: 'Fixed Rate',
      leadingLender: f1.leading_lender,
      effectiveDate: f1.effective_date,
    },
  ];

  return {
    success: true,
    source: publicSource,
    last_synced_utc: lastSynced,
    last_updated_human: lastUpdatedHuman,
    is_today: isToday,
    prime_rate: prime,
    benchmarks: {
      fixed_5yr: {
        insured: f5Insured,
        insurable: f5Insurable,
        conventional: f5Conventional,
        lowest: Math.min(f5Insured.lowest_rate, f5Insurable.lowest_rate, f5Conventional.lowest_rate),
      },
      fixed_3yr: {
        insured: f3Insured,
        insurable: f3Insurable,
        conventional: f3Conventional,
        lowest: Math.min(f3Insured.lowest_rate, f3Insurable.lowest_rate, f3Conventional.lowest_rate),
      },
      variable_5yr: {
        insured: v5Insured,
        insurable: v5Insurable,
        conventional: v5Conventional,
        lowest: Math.min(v5Insured.lowest_rate, v5Insurable.lowest_rate, v5Conventional.lowest_rate),
      },
      heloc,
      private_second: privateSecond,
      fixed_2yr: f2,
      fixed_1yr: f1,
      variable_3yr: v3,
      alt_1yr_fixed: rb['alt_1_year_fixed'],
      alt_2yr_fixed: rb['alt_2_year_fixed'],
      alt_3yr_fixed: rb['alt_3_year_fixed'],
      alt_heloc: rb['alt_heloc'],
      alt_bfs: rb['alt_bfs_stated_income'],
    },
    featured_rates: featuredRates,
    all_rates: allRates,
    // Same benchmarks, with spreadsheet-serial dates converted to ISO.
    raw_benchmarks: Object.fromEntries(
      Object.entries(rb).map(([key, b]) => [
        key,
        b && typeof b === 'object'
          ? {
              ...b,
              effective_date: normalizeEffectiveDate(b.effective_date),
              ...(Array.isArray(b.top_offers)
                ? { top_offers: b.top_offers.map((o: RateOffer) => ({ ...o, effective_date: normalizeEffectiveDate(o.effective_date) })) }
                : {}),
            }
          : b,
      ])
    ) as typeof rb,
  };
}

/**
 * Main public getter returning structured, verified mortgage rates intelligence.
 */
export function getLiveRatesData(): RatesApiResponse {
  const { feed, source } = readRawRatesFeed();
  return formatLiveRatesData(feed, source);
}

/**
 * Convenient single-value getters for calculators and widgets
 */
export function getDefaultBestRate(): number {
  try {
    const data = getLiveRatesData();
    return data.benchmarks.fixed_5yr.insured.lowest_rate || 4.39;
  } catch {
    return 4.39;
  }
}
