"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
export function CalculatorExperience({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className={pathname.includes("/calculators") ? "calculator-experience" : undefined}>{children}</div>;
}
