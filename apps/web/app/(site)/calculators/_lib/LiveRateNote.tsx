"use client";
import Link from "next/link";
import type { RatesApiResponse } from "@/types/rates";
import { LIVE_RATE_LABELS, ratesAsOf, type LiveRateProduct, type RateSource } from "./liveRateDefaults";

/**
 * Small note under a rate input that says where the default came from.
 * `suffix` describes any spread added to the benchmark, e.g. " + 2.80%" or " + 0.20% (credit tier)".
 */
export function LiveRateNote({ data, product, source, suffix = "", className = "" }: {
  data: RatesApiResponse | null | undefined;
  product: LiveRateProduct;
  source: RateSource;
  suffix?: string;
  className?: string;
}) {
  const asOf = ratesAsOf(data);
  return (
    <p className={`text-xs text-gray-400 mt-1.5 leading-relaxed ${className}`}>
      {source === "live" && asOf
        ? <>Default: {LIVE_RATE_LABELS[product]}{suffix} from our live rate feed (as of {asOf}).{" "}</>
        : source === "fallback" ? <>Illustrative default rate.{" "}</> : null}
      Use the rate you were actually offered, or{" "}
      <Link href="/rates" className="text-gold-300 underline underline-offset-4">see today&apos;s rates</Link>.
    </p>
  );
}
