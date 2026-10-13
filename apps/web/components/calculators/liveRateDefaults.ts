"use client";

import { useCallback, useEffect, useState } from "react";
import type { RatesApiResponse } from "@/types/rates";

/**
 * Live-rate defaults for calculators (FEAT-007).
 *
 * Selectors return `undefined` until /api/rates has actually answered, so a calculator keeps its
 * static fallback when the feed is down instead of silently switching to useLiveRates()' built-in
 * snapshot numbers. Note `useLiveRates().best5YrFixed` is the INSURED rate — refinances and
 * equity take-outs can't be insured, so they use the conventional benchmark here.
 */

const valid = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n > 0;

/** Lowest uninsured (conventional) 5-year fixed — the basis for refinances / equity take-outs. */
export function liveConventional5yr(data: RatesApiResponse | null | undefined): number | undefined {
  const r = data?.benchmarks?.fixed_5yr?.conventional?.lowest_rate;
  return valid(r) ? r : undefined;
}

/** Lowest insured 5-year fixed (high-ratio purchases). */
export function liveInsured5yr(data: RatesApiResponse | null | undefined): number | undefined {
  const r = data?.benchmarks?.fixed_5yr?.insured?.lowest_rate;
  return valid(r) ? r : undefined;
}

/** Lowest advertised HELOC rate. */
export function liveHeloc(data: RatesApiResponse | null | undefined): number | undefined {
  const r = data?.benchmarks?.heloc?.lowest_rate;
  return valid(r) ? r : undefined;
}

/**
 * Private lenders price well above prime. The live feed has listed A-lender products as
 * "Private 2nd" (e.g. 2026-10-13: MCAP / RMG at Prime + 0.50% = 4.95%), so rows below
 * prime + 2% are treated as mislabelled and skipped.
 */
const PRIVATE_MIN_SPREAD_OVER_PRIME = 2;
const FALLBACK_PRIME = 4.45;

/** Lowest plausible advertised private second-mortgage rate (best-case: low LTV, before lender/broker fees). */
export function livePrivateSecond(data: RatesApiResponse | null | undefined): number | undefined {
  const bench = data?.benchmarks?.private_second ?? data?.raw_benchmarks?.private_second;
  if (!bench) return undefined;
  const feedPrime = data?.prime_rate;
  const prime = valid(feedPrime) ? feedPrime : FALLBACK_PRIME;
  const floor = prime + PRIVATE_MIN_SPREAD_OVER_PRIME;
  const offers: unknown[] = Array.isArray(bench.top_offers) ? bench.top_offers.map((o: { rate?: unknown }) => o?.rate) : [];
  const candidates = [bench.lowest_rate, ...offers].filter((r): r is number => valid(r) && r >= floor && r <= 25);
  return candidates.length ? Math.min(...candidates) : undefined;
}

/** Prime rate from the feed. */
export function livePrime(data: RatesApiResponse | null | undefined): number | undefined {
  const r = data?.prime_rate;
  return valid(r) ? r : undefined;
}

/** "Oct 13, 2026" — the date the rate feed was last synced (Pacific time), or null before it loads. */
export function ratesAsOf(data: RatesApiResponse | null | undefined): string | null {
  const iso = data?.last_synced_utc;
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()) || d.getTime() <= 0) return null;
  return d.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric", timeZone: "America/Vancouver" });
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * A numeric input seeded from a live value until the user edits it.
 * `live` should come from one of the selectors above (undefined = keep `fallback`).
 */
export function useLiveDefault(fallback: number, live: number | undefined) {
  const [value, setValue] = useState<number>(fallback);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched && valid(live)) setValue(round2(live));
  }, [live, touched]);

  const set = useCallback((v: number) => {
    setTouched(true);
    setValue(v);
  }, []);

  /** Go back to following the live feed (or the static fallback). */
  const reset = useCallback(() => {
    setTouched(false);
    setValue(valid(live) ? round2(live) : fallback);
  }, [live, fallback]);

  return { value, set, reset, touched, isLive: !touched && valid(live) };
}
