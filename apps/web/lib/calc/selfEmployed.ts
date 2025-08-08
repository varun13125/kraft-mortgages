export function normalizedIncome({ noa1, noa2, noa3, addbacks = 0 }:{ noa1:number; noa2:number; noa3:number; addbacks?:number }){
  const avg2 = (noa1 + noa2) / 2 + addbacks;
  const lower = Math.min(noa1 + addbacks, noa2 + addbacks);
  const threeTrend = (noa1 + noa2 + noa3) / 3 + addbacks;
  return { qualifyingIncome: Math.min(avg2, lower), threeYearAvg: threeTrend };
}
