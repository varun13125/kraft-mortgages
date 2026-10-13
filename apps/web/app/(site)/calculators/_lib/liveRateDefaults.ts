"use client";
// Live-rate defaults for the residential calculators (FEAT-007 / BUG-019).
//
// Each calculator keeps a static fallback rate as its initial value (so the page renders
// instantly and still works if /api/rates fails), then switches to today's benchmark from
// the live feed once it arrives — but only if the visitor hasn't touched the field yet.
//
// Benchmark choice matters:
//  - `fixed5Insured` (= useLiveRates().best5YrFixed) is the INSURED rate. Use it only for
//    purchases with < 20% down (CMHC/Sagen/Canada Guaranty insured).
//  - Refinances, rentals, 30-yr amortization with 20%+ down and $1.5M+ homes are uninsured:
//    use `fixed5Conventional`.
//  - B-lender (alternative) products live under `raw_benchmarks.alt_*`; private seconds under
//    `benchmarks.private_second`.
// All values are the feed's `lowest_rate` (best available rate in the feed), matching the
// "From x%" figures shown on /rates. Pages say so in their hint text.
import { useCallback, useEffect, useRef, useState } from "react";
import type { RatesApiResponse } from "@/types/rates";

export type LiveRateProduct =
  | "fixed5Insured"
  | "fixed5Insurable"
  | "fixed5Conventional"
  | "fixed3Insured"
  | "fixed3Conventional"
  | "variable5Insured"
  | "variable5Conventional"
  | "prime"
  | "heloc"
  | "altHeloc"
  | "alt1Fixed"
  | "alt2Fixed"
  | "alt3Fixed"
  | "alt5Fixed"
  | "altBfs"
  | "privateSecond";

/** Phrase for hint text, e.g. "Default: today's lowest insured 5-year fixed rate". */
export const LIVE_RATE_LABELS: Record<LiveRateProduct, string> = {
  fixed5Insured: "today's lowest insured 5-year fixed rate",
  fixed5Insurable: "today's lowest insurable 5-year fixed rate",
  fixed5Conventional: "today's lowest conventional (uninsured) 5-year fixed rate",
  fixed3Insured: "today's lowest insured 3-year fixed rate",
  fixed3Conventional: "today's lowest conventional 3-year fixed rate",
  variable5Insured: "today's lowest insured 5-year variable rate",
  variable5Conventional: "today's lowest conventional 5-year variable rate",
  prime: "today's prime rate",
  heloc: "today's lowest A-lender HELOC rate",
  altHeloc: "today's lowest B-lender HELOC rate",
  alt1Fixed: "today's lowest B-lender 1-year fixed rate",
  alt2Fixed: "today's lowest B-lender 2-year fixed rate",
  alt3Fixed: "today's lowest B-lender 3-year fixed rate",
  alt5Fixed: "today's lowest B-lender 5-year fixed rate",
  altBfs: "today's lowest B-lender stated-income rate",
  privateSecond: "today's lowest private second-mortgage rate",
};

function sane(v: unknown): number | undefined {
  const n = typeof v === "string" ? Number(v) : v;
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0.25 || n > 25) return undefined;
  return Math.round(n * 100) / 100;
}

function rawLowest(data: RatesApiResponse, key: string): number | undefined {
  const raw = data.raw_benchmarks?.[key] as { lowest_rate?: unknown } | undefined;
  return sane(raw?.lowest_rate);
}

/** Today's benchmark for a product from the /api/rates payload, or undefined if unavailable. */
export function liveRate(data: RatesApiResponse | null | undefined, product: LiveRateProduct): number | undefined {
  if (!data || !data.success || !data.benchmarks) return undefined;
  const b = data.benchmarks;
  switch (product) {
    case "fixed5Insured": return sane(b.fixed_5yr?.insured?.lowest_rate);
    case "fixed5Insurable": return sane(b.fixed_5yr?.insurable?.lowest_rate);
    case "fixed5Conventional": return sane(b.fixed_5yr?.conventional?.lowest_rate);
    case "fixed3Insured": return sane(b.fixed_3yr?.insured?.lowest_rate);
    case "fixed3Conventional": return sane(b.fixed_3yr?.conventional?.lowest_rate);
    case "variable5Insured": return sane(b.variable_5yr?.insured?.lowest_rate);
    case "variable5Conventional": return sane(b.variable_5yr?.conventional?.lowest_rate);
    case "prime": return sane(data.prime_rate);
    case "heloc": return sane(b.heloc?.lowest_rate);
    case "altHeloc": return rawLowest(data, "alt_heloc") ?? sane(b.alt_heloc?.lowest_rate);
    case "alt1Fixed": return rawLowest(data, "alt_1_year_fixed") ?? sane(b.alt_1yr_fixed?.lowest_rate);
    case "alt2Fixed": return rawLowest(data, "alt_2_year_fixed") ?? sane(b.alt_2yr_fixed?.lowest_rate);
    case "alt3Fixed": return rawLowest(data, "alt_3_year_fixed") ?? sane(b.alt_3yr_fixed?.lowest_rate);
    case "alt5Fixed": return rawLowest(data, "alt_5_year_fixed");
    case "altBfs": return rawLowest(data, "alt_bfs_stated_income") ?? sane(b.alt_bfs?.lowest_rate);
    case "privateSecond": return sane(b.private_second?.lowest_rate);
    default: return undefined;
  }
}

/**
 * Median rate across lenders for a raw feed key (e.g. "5_year_fixed_insured"), when the feed provides it.
 * Useful as a "typical lender" rate next to the lowest rate.
 */
export function liveMedianRate(data: RatesApiResponse | null | undefined, rawKey: string): number | undefined {
  if (!data?.success) return undefined;
  const raw = data.raw_benchmarks?.[rawKey] as { median_rate?: unknown } | undefined;
  return sane(raw?.median_rate);
}

export interface BenchmarkRow { lowest?: number; median?: number; feePct?: number; lenderCount?: number }

/** Lowest / median rate, typical lender fee and lender count for a raw feed key, when present. */
export function liveBenchmark(data: RatesApiResponse | null | undefined, rawKey: string): BenchmarkRow | undefined {
  if (!data?.success) return undefined;
  const raw = data.raw_benchmarks?.[rawKey] as
    { lowest_rate?: unknown; median_rate?: unknown; typical_lender_fee_pct?: unknown; lender_count?: unknown } | undefined;
  if (!raw) return undefined;
  const lowest = sane(raw.lowest_rate);
  if (lowest === undefined) return undefined;
  const fee = typeof raw.typical_lender_fee_pct === "number" && raw.typical_lender_fee_pct >= 0 && raw.typical_lender_fee_pct <= 10
    ? raw.typical_lender_fee_pct : undefined;
  const count = typeof raw.lender_count === "number" && raw.lender_count > 0 ? raw.lender_count : undefined;
  return { lowest, median: sane(raw.median_rate), feePct: fee, lenderCount: count };
}

/**
 * 5-yr fixed benchmark for a purchase:
 *  - < 20% down → insured;
 *  - 20%+ down, price under $1.5M and amortization ≤ 25 years → insurable (lender can bulk-insure);
 *  - otherwise (30-yr with 20%+ down, $1.5M+) → conventional.
 */
export function purchaseRateProduct(downPct: number, price = 0, amortYears = 25): LiveRateProduct {
  if (downPct < 20) return "fixed5Insured";
  if (price < 1_500_000 && amortYears <= 25) return "fixed5Insurable";
  return "fixed5Conventional";
}

/** "Oct 13, 2026" from the feed's sync timestamp, or null. */
export function ratesAsOf(data: RatesApiResponse | null | undefined): string | null {
  if (!data?.success || !data.last_synced_utc) return null;
  const d = new Date(data.last_synced_utc);
  if (Number.isNaN(d.getTime()) || d.getTime() <= 0) return null;
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric", timeZone: "America/Vancouver" });
}

export type RateSource = "fallback" | "live" | "user";

/**
 * A rate input whose default follows the live feed until the visitor edits it.
 * Returns [value, setValue (marks the field as edited), source].
 * `live` may already include a spread (e.g. prime + 2.8); it is rounded to 2 decimals.
 */
export function useLiveDefault(fallback: number, live: number | undefined): [number, (v: number) => void, RateSource] {
  const [value, setValue] = useState(fallback);
  const [source, setSource] = useState<RateSource>("fallback");
  const touched = useRef(false);

  useEffect(() => {
    if (touched.current || live === undefined || !Number.isFinite(live)) return;
    setValue(Math.round(live * 100) / 100);
    setSource("live");
  }, [live]);

  const set = useCallback((v: number) => {
    touched.current = true;
    setSource("user");
    setValue(v);
  }, []);

  return [value, set, source];
}
