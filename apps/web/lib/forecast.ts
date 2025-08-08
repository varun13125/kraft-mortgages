export function movingAverage(series: number[], window = 7) {
  const out: number[] = [];
  for (let i=0; i<series.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = series.slice(start, i+1);
    out.push(slice.reduce((a,b)=>a+b,0) / slice.length);
  }
  return out;
}

export function linearProjection(series: number[], steps = 14) {
  const n = series.length;
  if (n < 2) return Array(steps).fill(series[0] || 0);
  const xs = Array.from({length:n}, (_,i)=>i);
  const xmean = xs.reduce((a,b)=>a+b,0)/n;
  const ymean = series.reduce((a,b)=>a+b,0)/n;
  let num=0, den=0;
  for (let i=0;i<n;i++){ num += (xs[i]-xmean)*(series[i]-ymean); den += (xs[i]-xmean)**2; }
  const m = den===0?0:num/den;
  const b = ymean - m*xmean;
  const proj: number[] = [];
  for (let k=1;k<=steps;k++){ const x = n-1 + k; proj.push(m*x + b); }
  return proj;
}
