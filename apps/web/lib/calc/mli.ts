export type MliTier = "Select" | "Mild" | "None";
export type Pillar = "affordability" | "accessibility" | "energy";

export interface MliInput {
  units: number;
  purchasePrice: number;
  loanAmount: number;
  termYears: number;
  scores: Partial<Record<Pillar, number>>;
}

const PREMIUM_TABLE: Record<string, number> = {
  "": 0.04,
  affordability: 0.035,
  energy: 0.0325,
  accessibility: 0.0325,
  "affordability|energy": 0.028,
  "affordability|accessibility": 0.028,
  "energy|accessibility": 0.028,
  "affordability|energy|accessibility": 0.025
};

export function pillarsAttained(scores: Partial<Record<Pillar, number>>): Pillar[] {
  const res: Pillar[] = [];
  for (const k of ["affordability","energy","accessibility"] as Pillar[]) {
    const s = scores[k] ?? 0;
    if (s >= 60) res.push(k);
  }
  return res.sort();
}

export function estimateMliPremium(input: MliInput) {
  const attained = pillarsAttained(input.scores);
  const key = attained.join("|");
  const rate = PREMIUM_TABLE[key] ?? PREMIUM_TABLE[""];
  const premium = input.loanAmount * rate;
  return { rate, premium, attained };
}

export function maxLTV(units: number) {
  if (units >= 50) return 0.95;
  if (units >= 5) return 0.95;
  return 0.95;
}
