// Self-employed qualifying income (A-lender convention). Not financial advice.
// noa1 = most recent year, noa2 = prior year, noa3 = two years ago (NOA / T1 line 15000).
// Stable or rising income -> 2-year average; falling income -> the lower, most recent year.
// i.e. qualifying = min(latest, 2-year average) + add-backs.
export function normalizedIncome({ noa1, noa2, noa3, addbacks = 0 }:{ noa1:number; noa2:number; noa3:number; addbacks?:number }){
  const avg2 = (noa1 + noa2) / 2;
  const qualifying = Math.min(avg2, noa1) + addbacks;
  const threeTrend = (noa1 + noa2 + noa3) / 3 + addbacks;
  return { qualifyingIncome: Math.max(0, qualifying), threeYearAvg: threeTrend };
}
