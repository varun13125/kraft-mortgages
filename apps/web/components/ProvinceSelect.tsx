"use client";
import { useAppStore } from "@/store/useAppStore";

type Province = "BC" | "AB" | "ON";

const PROVINCES: { value: Province; label: string }[] = [
  { value: "BC", label: "BC" },
  { value: "AB", label: "AB" },
  { value: "ON", label: "ON" },
];

/**
 * Province picker wired to the app store. The store's province drives the
 * province-specific disclaimers in ComplianceBanner and the chat assistant.
 * The choice is persisted to localStorage by the store and restored by PrefSync.
 */
export function ProvinceSelect({
  id,
  /** Extra classes; include a text size (defaults to text-sm). */
  className = "text-sm",
  label = "Select your province",
}: {
  id?: string;
  className?: string;
  /** Accessible name (the visible text is just the 2-letter code). */
  label?: string;
}) {
  const province = useAppStore((s) => s.province);
  const setProvince = useAppStore((s) => s.setProvince);
  return (
    <select
      id={id}
      className={`bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-white hover:border-gold-500/60 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 ${className}`}
      value={province}
      onChange={(e) => setProvince(e.target.value as Province)}
      aria-label={label}
      title="Province (sets the disclosures shown on calculators)"
    >
      {PROVINCES.map((p) => (
        <option key={p.value} value={p.value} className="bg-gray-800 text-white">
          {p.label}
        </option>
      ))}
    </select>
  );
}
