"use client";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { evaluate } from "@/lib/compliance/rules";

export function ComplianceBanner({ feature }: { feature: "CHATBOT"|"VOICE"|"CALC_CONSTRUCTION"|"CALC_MLI"|"LEAD_FORM" }) {
  const province = useAppStore(s => s.province);
  const [texts, setTexts] = useState<string[]>([]);
  useEffect(() => {
    const r = evaluate(province as any, feature);
    setTexts(r.disclaimers);
  }, [province, feature]);
  return (
    <div className="rounded-md border border-yellow-600 bg-yellow-900/20 text-yellow-200 p-3 text-xs space-y-1">
      {texts.map((t,i)=> <div key={i}>⚠️ {t}</div>)}
    </div>
  );
}
