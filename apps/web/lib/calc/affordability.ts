export function stressTestRate(quotedAprPct: number, minQualPct = 5.25) {
  return Math.max(quotedAprPct + 2, minQualPct);
}
export function gdsTds({ incomeAnnual, housingCostsAnnual, totalDebtAnnual }:{incomeAnnual:number;housingCostsAnnual:number;totalDebtAnnual:number;}){
  const gds = (housingCostsAnnual / incomeAnnual) * 100;
  const tds = ((housingCostsAnnual + totalDebtAnnual) / incomeAnnual) * 100;
  return { gds, tds };
}
