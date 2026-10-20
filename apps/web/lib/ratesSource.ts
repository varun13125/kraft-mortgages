import { formatLiveRatesData, getLiveRatesData } from "./rates";
import type { RawRatesFeed, RatesApiResponse } from "../types/rates";

/** The rates page and chat use the same URL, timeout and Next fetch-cache policy. */
export async function loadCurrentRates(): Promise<RatesApiResponse | null> {
  const url = process.env.RATES_FEED_URL || "https://blog.kraftmortgages.ca/current_rates.json";
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3500), next: { revalidate: 300 } });
    if (response.ok) {
      const raw = await response.json() as RawRatesFeed;
      if (raw?.rate_benchmarks) return formatLiveRatesData(raw, url);
    }
  } catch { /* Dated local backup; consumers must check freshness before quoting. */ }
  try { return getLiveRatesData(); } catch { return null; }
}
