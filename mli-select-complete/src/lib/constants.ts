export const DEFAULTS = {
  tiers: [50, 70, 100],
  amortByTier: { 50: 40, 70: 45, 100: 50 },
  ltvExistingByTier: { 50: 0.85, 70: 0.95, 100: 0.95 },
  ltcNewByTier: { 50: 0.95, 70: 0.95, 100: 0.95 },
  minDCR: 1.10,
  premiumDiscountByTier: { 50: 0.10, 70: 0.20, 100: 0.30 },
  affordabilityNew: [
    { pts: 50, pct: 10 }, { pts: 70, pct: 15 }, { pts: 100, pct: 25 }
  ],
  affordabilityExisting: [
    { pts: 50, pct: 40 }, { pts: 70, pct: 60 }, { pts: 100, pct: 80 }
  ],
  affordabilityBonusYears: 20,
  affordabilityBonusPoints: 30,
};
