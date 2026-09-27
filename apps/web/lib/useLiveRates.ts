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
  best5YrFixed: 4.44,
  best3YrFixed: 4.34,
  best5YrVariable: 3.44,
  bestHeloc: 4.95,
  bestPrivateSecond: 7.99,
  primeRate: 4.45,
};

export function useLiveRates(): UseLiveRatesReturn {
  const [data, setData] = useState<RatesApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/rates');
      if (!res.ok) {
        throw new Error(`Failed to fetch rates: ${res.statusText}`);
      }
      const json: RatesApiResponse = await res.json();
      if (json.success) {
        setData(json);
        setError(null);
      } else {
        throw new Error('Rates response unsuccessful');
      }
    } catch (err: any) {
      console.warn('[useLiveRates] Error fetching live rates, using verified fallback:', err);
      setError(err?.message || 'Failed to load live rates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

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
  const isToday = data?.is_today ?? true;
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
    refresh: fetchRates,
  };
}
