"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { pmt, amortizationSchedule } from "@/lib/calcs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AmortizationPage() {
  const [loan, setLoan] = useState(15000000);
  const [rate, setRate] = useState(4.5);

  const yearsList = [25, 40, 50] as const;
  const payments = yearsList.map(y => ({ years: y, payment: Math.round(pmt(rate, y, loan)) }));
  const schedule50 = amortizationSchedule(rate, 50, loan).rows
    .filter(r => r.period % 12 === 0)
    .map(r => ({ year: r.period/12, balance: Math.round(r.balance) }));

  return (<>
    <SectionHero title="Amortization Comparison" subtitle="See payments across 25 vs 40 vs 50 years and a 50-year payoff curve." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>Loan Amount ($)</label>
            <input type="number" value={loan} onChange={e=>setLoan(+e.target.value)} />
            <label>Interest Rate (%)</label>
            <input type="number" step={0.05} value={rate} onChange={e=>setRate(+e.target.value)} />
          </div>
        </Card>
        <Card title="Monthly Payment (approx.)">
          <div className="grid gap-2 text-sm">
            {payments.map(p => (
              <div key={p.years} className="flex items-center justify-between">
                <div>{p.years} years</div>
                <div className="font-semibold">${p.payment.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="lg:col-span-2">
          <Card title="50-Year Balance Curve">
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <AreaChart data={schedule50} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopOpacity={0.6} />
                      <stop offset="100%" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v)=>`$${(v/1e6).toFixed(1)}M`} />
                  <Tooltip formatter={(v)=>`$${Number(v).toLocaleString()}`} />
                  <Area type="monotone" dataKey="balance" strokeWidth={2} fill="url(#g)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </section>
  </>);
}
