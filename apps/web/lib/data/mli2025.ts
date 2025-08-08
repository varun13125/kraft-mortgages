/**
 * Placeholder premium table for MLI Select 2025 — replace with verified data.
 * Structure allows swapping without code changes.
 */
export type PremiumRow = { pillars: string[]; rate: number };
export const MLI_2025_PREMIUMS: PremiumRow[] = [
  { pillars: [], rate: 0.04 },
  { pillars: ["affordability"], rate: 0.035 },
  { pillars: ["energy"], rate: 0.0325 },
  { pillars: ["accessibility"], rate: 0.0325 },
  { pillars: ["affordability","energy"], rate: 0.028 },
  { pillars: ["affordability","accessibility"], rate: 0.028 },
  { pillars: ["energy","accessibility"], rate: 0.028 },
  { pillars: ["affordability","energy","accessibility"], rate: 0.025 },
];
