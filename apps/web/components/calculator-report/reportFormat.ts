/** Value formatters for PDF report rows (rounded, en-CA; non-finite values print as "N/A"). */
export const money = (n: number) =>
  Number.isFinite(n) ? `${n < 0 ? "-" : ""}$${Math.round(Math.abs(n)).toLocaleString("en-CA")}` : "N/A";

export const pct = (n: number, decimals = 2) => (Number.isFinite(n) ? `${n.toFixed(decimals)}%` : "N/A");

export const num = (n: number, decimals = 2) => (Number.isFinite(n) ? n.toFixed(decimals) : "N/A");
