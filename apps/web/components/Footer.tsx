import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  "QUICK LINKS": [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/#services" },
    { label: "Calculators", href: "/#calculators" },
    { label: "MLI Select", href: "/mli-select" },
    { label: "Blog", href: "/blog" },
  ],
  "CONTACT": [
    { label: "604-593-1550", href: "tel:604-593-1550" },
    { label: "604-727-1579", href: "tel:604-727-1579" },
    { label: "varun@kraftmortgages.ca", href: "mailto:varun@kraftmortgages.ca" },
    { label: "#301 1688 152nd Street", href: undefined },
    { label: "Surrey, BC V4A 4N2", href: undefined },
  ],
  "LICENSED IN": [
    { label: "✓ British Columbia", href: undefined },
    { label: "✓ Alberta", href: undefined },
    { label: "✓ Ontario", href: undefined },
    { label: "FSRA Licence #12918", href: undefined },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-term-footer border-t border-term-line text-term-text-dim px-6 sm:px-8 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto grid gap-14 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] mb-14">
        {/* Brand Column */}
        <div>
          <Image
            src="/kraft-logo-light.png"
            alt="Kraft Mortgages Canada Inc."
            width={180}
            height={44}
            className="h-11 w-auto mb-6"
          />
          <p className="text-sm leading-relaxed max-w-[340px]">
            18+ Years Combined Experience in complex mortgage solutions across British Columbia, Alberta, and Ontario.
          </p>
        </div>

        {/* Link Columns */}
        {Object.entries(FOOTER_LINKS).map(([heading, items]) => (
          <div key={heading}>
            <div className="font-mono text-[10px] text-term-gold tracking-[0.15em] mb-4">
              {heading}
            </div>
            {items.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-[13px] mb-2 text-term-text-dim hover:text-term-text transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.label} className="text-[13px] mb-2">
                  {item.label}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-6 border-t border-term-line-dim font-mono text-[10px] text-term-text-mute tracking-[0.08em]">
        <span>© {new Date().getFullYear()} KRAFT MORTGAGES CANADA INC. · FSRA Licence #12918</span>
        <span>SURREY · CALGARY · TORONTO</span>
      </div>
    </footer>
  );
}
