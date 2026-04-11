import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Self-Employed A-Lender vs B-Lender Calculator | Kraft Mortgages",
  description:
    "Compare A-lender (bank) vs B-lender (alternative) mortgage costs for self-employed borrowers. See the hidden tax trap and find the mathematically better path.",
  alternates: { canonical: "https://www.kraftmortgages.ca/calculators/self-employed-a-vs-b" },
  openGraph: {
    title: "Self-Employed A-Lender vs B-Lender Calculator | Kraft Mortgages",
    description:
      "Compare A-lender (bank) vs B-lender (alternative) mortgage costs for self-employed borrowers. See the hidden tax trap and find the mathematically better path.",
    url: "https://www.kraftmortgages.ca/calculators/self-employed-a-vs-b",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            name: "Self-Employed A-Lender vs B-Lender Calculator",
            description:
              "Compare total costs between bank (A-lender) and alternative (B-lender) mortgage financing for self-employed borrowers in Canada.",
            provider: {
              "@type": "FinancialService",
              name: "Kraft Mortgages",
              url: "https://www.kraftmortgages.ca",
            },
            areaServed: ["CA-BC", "CA-AB", "CA-ON"],
            serviceType: "Mortgage Brokerage",
          }),
        }}
      />
    </>
  );
}
