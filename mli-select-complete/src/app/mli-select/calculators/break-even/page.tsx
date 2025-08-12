"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";
import { pmt, breakEvenRentPerUnit } from "@/lib/calcs";

export default function BreakEvenPage() {
  const [loan, setLoan] = useState(15000000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(40);
  const [units, setUnits] = useState(100);
  const [otherOpex, setOtherOpex] = useState(120000/12);
  const [margin, setMargin] = useState(0);

  const monthlyDebt = pmt(rate, years, loan);
  const rentPerUnit = breakEvenRentPerUnit({
    monthlyDebtService: monthlyDebt,
    otherMonthlyOpex: otherOpex,
    units,
    targetMargin: margin/100
  });

  return (<>
    <SectionHero title="Break-Even Rent" subtitle="Find the minimum rent per unit to cover debt service and ops." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 lg:grid-cols-2">
        <Card title="Inputs">
          <div className="grid gap-3">
            <label>Loan Amount ($)</label>
            <input type="number" value={loan} onChange={e=>setLoan(+e.target.value)} />
            <label>Interest Rate (%)</label>
            <input type="number" step={0.05} value={rate} onChange={e=>setRate(+e.target.value)} />
            <label>Amortization (years)</label>
            <input type="number" value={years} onChange={e=>setYears(+e.target.value)} />
            <label>Total Units</label>
            <input type="number" value={units} onChange={e=>setUnits(+e.target.value)} />
            <label>Other Monthly Opex ($)</label>
            <input type="number" value={otherOpex} onChange={e=>setOtherOpex(+e.target.value)} />
            <label>Target Margin (%)</label>
            <input type="number" value={margin} onChange={e=>setMargin(+e.target.value)} />
          </div>
        </Card>
        <Card title="Result">
          <div className="text-sm">
            Monthly debt service ≈ <b>${Math.round(monthlyDebt).toLocaleString()}</b><br/>
            Required rent / unit ≈ <b>${Math.round(rentPerUnit).toLocaleString()}</b> / month
          </div>
        </Card>
      </div>
    </section>
  </>);
}
