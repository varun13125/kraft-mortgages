'use client';

import { useState, useEffect, useCallback } from 'react';
import { RatesApiResponse, RateCardItem } from '@/types/rates';

interface UseLiveRatesReturn {
  data: RatesApiResponse | null;
  loading: boolean;
  error: string | null;
  best5YrFixed: number;
  best3YrFixed: number;
  best5YrVariable: number;
  bestHeloc: number;
  bestPrivateSecond: number;
  primeRate: number;
  isToday: boolean;
  featuredRates: RateCardItem[];
  allRates: RateCardItem[];
  refresh: () => Promise<void>;
}

// Initial default benchmarks to prevent hydration mismatch and provide instant UI
const DEFAULT_RATES = {
  best5YrFixed: 4.39,
  best3YrFixed: 4.34,
  best5YrVariable: 3.44,
  bestHeloc: 4.95,
  bestPrivateSecond: 7.99,
  primeRate: 4.45,
};

// ---------------------------------------------------------------------------
// Shared, module-level request cache.
// Several components can use this hook on one page (e.g. the homepage's
// RatesTicker + TodaysRates). Without sharing, each instance fired its own
// GET /api/rates. Now concurrent callers join a single in-flight request, and a
// successful response is reused for CACHE_TTL_MS (also across client-side
// navigations). Errors are not cached, so the next mount retries.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 5 * 60 * 1000;

let cached: { data: RatesApiResponse; at: number } | null = null;
let inFlight: Promise<RatesApiResponse> | null = null;
const subscribers = new Set<(data: RatesApiResponse) => void>();

function freshCache(): RatesApiResponse | null {
  return cached && Date.now() - cached.at < CACHE_TTL_MS ? cached.data : null;
}

async function requestRates(): Promise<RatesApiResponse> {
  const res = await fetch('/api/rates');
  if (!res.ok) {
    throw new Error(`Failed to fetch rates: ${res.statusText}`);
  }
  const json: RatesApiResponse = await res.json();
  if (!json.success) {
    throw new Error('Rates response unsuccessful');
  }
  return json;
}

/** One network request at a time; resolves from cache when fresh (unless forced). */
function loadRates(force = false): Promise<RatesApiResponse> {
  const hit = force ? null : freshCache();
  if (hit) return Promise.resolve(hit);
  if (inFlight) return inFlight;

  const request = requestRates().then((json) => {
    cached = { data: json, at: Date.now() };
    // Keep every mounted hook in sync (e.g. after one instance calls refresh()).
    subscribers.forEach((notify) => notify(json));
    return json;
  });
  inFlight = request;
  // Clear the slot once settled (only if a newer request hasn't replaced it).
  request
    .finally(() => {
      if (inFlight === request) inFlight = null;
    })
    .catch(() => {
      /* handled by the awaiting caller */
    });
  return request;
}

export function useLiveRates(): UseLiveRatesReturn {
  // Always start from null on the first render (server and hydration render must
  // match); a fresh cache is applied in the effect below without a network call.
  const [data, setData] = useState<RatesApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async (force = false) => {
    try {
      setLoading(true);
      const json = await loadRates(force);
      setData(json);
      setError(null);
    } catch (err: any) {
      console.warn('[useLiveRates] Error fetching live rates, using verified fallback:', err);
      setError(err?.message || 'Failed to load live rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const onData = (json: RatesApiResponse) => {
      if (!active) return;
      setData(json);
      setError(null);
      setLoading(false);
    };
    subscribers.add(onData);

    const hit = freshCache();
    if (hit) {
      onData(hit);
    } else {
      fetchRates();
    }

    return () => {
      active = false;
      subscribers.delete(onData);
    };
  }, [fetchRates]);

  const refresh = useCallback(() => fetchRates(true), [fetchRates]);

  const best5YrFixed =
    data?.benchmarks?.fixed_5yr?.insured?.lowest_rate ??
    data?.benchmarks?.fixed_5yr?.lowest ??
    DEFAULT_RATES.best5YrFixed;

  const best3YrFixed =
    data?.benchmarks?.fixed_3yr?.insured?.lowest_rate ??
    data?.benchmarks?.fixed_3yr?.lowest ??
    DEFAULT_RATES.best3YrFixed;

  const best5YrVariable =
    data?.benchmarks?.variable_5yr?.insured?.lowest_rate ??
    data?.benchmarks?.variable_5yr?.lowest ??
    DEFAULT_RATES.best5YrVariable;

  const bestHeloc =
    data?.benchmarks?.heloc?.lowest_rate ??
    DEFAULT_RATES.bestHeloc;

  const bestPrivateSecond =
    data?.benchmarks?.private_second?.lowest_rate ??
    DEFAULT_RATES.bestPrivateSecond;

  const primeRate = data?.prime_rate ?? DEFAULT_RATES.primeRate;
  // Fallback defaults are NOT today's rates - don't claim they are.
  const isToday = data?.is_today ?? false;
  const featuredRates = data?.featured_rates ?? [];
  const allRates = data?.all_rates ?? [];

  return {
    data,
    loading,
    error,
    best5YrFixed,
    best3YrFixed,
    best5YrVariable,
    bestHeloc,
    bestPrivateSecond,
    primeRate,
    isToday,
    featuredRates,
    allRates,
    refresh,
  };
}
