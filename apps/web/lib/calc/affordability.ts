// OSFI minimum qualifying rate (B-20): greater of contract rate + 2% or 5.25%.
export function stressTestRate(quotedAprPct: number, minQualPct = 5.25) {
  return Math.max(quotedAprPct + 2, minQualPct);
}

/**
 * GDS / TDS as percentages of gross income. GDS housing costs should be
 * P&I (at the qualifying rate) + property tax + heat + 50% of condo fees.
 * Returns Infinity for non-positive income so callers never "pass" on bad input.
 */
export function gdsTds({ incomeAnnual, housingCostsAnnual, totalDebtAnnual }:{incomeAnnual:number;housingCostsAnnual:number;totalDebtAnnual:number;}){
  if (!(incomeAnnual > 0)) return { gds: Infinity, tds: Infinity };
  const gds = (housingCostsAnnual / incomeAnnual) * 100;
  const tds = ((housingCostsAnnual + totalDebtAnnual) / incomeAnnual) * 100;
  return { gds, tds };
}
