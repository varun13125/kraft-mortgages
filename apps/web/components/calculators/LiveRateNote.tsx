import Link from "next/link";

/**
 * One-line provenance note under a rate input or rate figure:
 * - live:      "Pre-filled from today's lowest <label>: 4.39% (as of Oct 13, 2026). All rates"
 * - edited:    "Your rate. Today's lowest <label>: 4.39% · Use live rate"
 * - no feed:   "Example rate — live rates unavailable · All rates"
 */
export function LiveRateNote({
  label,
  liveRate,
  asOf,
  touched = false,
  loading = false,
  onReset,
  extra,
  className = "text-xs text-gray-400 mt-1",
}: {
  /** e.g. "conventional 5-yr fixed" */
  label: string;
  liveRate?: number;
  asOf: string | null;
  touched?: boolean;
  loading?: boolean;
  onReset?: () => void;
  /** Extra disclosure appended, e.g. "+ 0.75% est. credit spread" */
  extra?: string;
  className?: string;
}) {
  const ratesLink = (
    <Link href="/rates" className="underline hover:text-gray-300">
      All rates
    </Link>
  );

  if (liveRate === undefined) {
    return (
      <p className={className}>
        {loading ? "Loading today's rates…" : "Example rate — live rates unavailable."} {ratesLink}
      </p>
    );
  }

  const live = `lowest ${label}: ${liveRate.toFixed(2)}%${asOf ? ` (as of ${asOf})` : ""}`;
  return (
    <p className={className}>
      {touched ? "Your rate. Today's " : "Pre-filled from today's "}
      {live}
      {extra ? ` ${extra}` : ""}
      {". "}
      {touched && onReset ? (
        <button type="button" onClick={onReset} className="underline hover:text-gray-300">
          Use live rate
        </button>
      ) : (
        ratesLink
      )}
    </p>
  );
}
