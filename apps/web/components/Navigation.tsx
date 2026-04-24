"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Calculators", href: "/#calculators" },
  { label: "MLI Select", href: "/mli-select" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 border-b border-term-line-dim bg-term-deep/95 backdrop-blur-md">
      {/* Ticker Bar */}
      <div className="hidden md:flex items-center px-6 py-2 font-mono text-[11px] text-term-text-dim gap-8 border-b border-term-line-dim tracking-[0.04em]">
        <span>KRAFT · MKT · OPEN</span>
        <span className="text-term-gold">▲ 5-YR FIXED 4.69</span>
        <span className="text-term-green">▼ VARIABLE 5.20</span>
        <span>BOC O/N 3.75</span>
        <span>CMHC 5-YR 3.98</span>
        <span>GOC · 5Y 3.12</span>
        <span className="ml-auto">APR 2026 · LIVE</span>
      </div>

      {/* Main Nav */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/kraft-logo-light.png"
            alt="Kraft Mortgages Canada Inc."
            width={180}
            height={42}
            className="h-9 sm:h-10 w-auto"
            priority
          />
        </Link>

        <nav className="hidden lg:flex gap-8 font-mono text-xs tracking-[0.06em] uppercase">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href
                  ? "text-term-text"
                  : "text-term-text-dim hover:text-term-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:604-593-1550"
            className="font-mono text-[11px] text-term-text-dim hover:text-term-text transition-colors"
          >
            604·593·1550
          </a>
          <a
            href="https://r.mtg-app.com/varun-chaudhry"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-term-gold text-term-deep font-mono text-xs font-semibold tracking-[0.08em] px-5 py-2.5 hover:bg-term-gold-bright transition-colors"
          >
            APPLY NOW →
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-term-text p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-term-line-dim bg-term-deep">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm tracking-[0.06em] uppercase text-term-text-dim hover:text-term-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-term-line-dim">
              <a href="tel:604-593-1550" className="font-mono text-xs text-term-text-dim">
                604·593·1550
              </a>
              <a
                href="https://r.mtg-app.com/varun-chaudhry"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-term-gold text-term-deep font-mono text-xs font-semibold tracking-[0.08em] px-5 py-3 text-center"
              >
                APPLY NOW →
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
