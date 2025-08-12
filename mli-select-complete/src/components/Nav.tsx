"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const links = [
  { href: "/mli-select/overview", label: "Overview" },
  { href: "/mli-select/eligibility", label: "Eligibility" },
  { href: "/mli-select/scoring", label: "Scoring" },
  { href: "/mli-select/benefits", label: "Benefits" },
  { href: "/mli-select/application-process", label: "Process" },
  { href: "/mli-select/compare-programs", label: "Compare" },
  { href: "/mli-select/faq", label: "FAQ" },
  { href: "/mli-select/calculators", label: "Calculators" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Kraft Mortgages" width={28} height={28} />
          <span className="text-sm font-semibold">Kraft Mortgages • MLI Select</span>
        </Link>
        <nav className="hidden md:flex gap-5">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href as any}
              className={`text-sm hover:text-brand-blue ${path?.startsWith(l.href) ? "text-brand-blue font-semibold" : "text-slate-700"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="btn btn-primary hidden md:inline-flex">Contact</Link>
      </div>
    </header>
  );
}
