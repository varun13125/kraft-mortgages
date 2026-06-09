import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance, Security & Consumer Protection Hub | Kraft Mortgages Canada Inc.",
  description:
    "Kraft Mortgages Canada Inc. is fully licensed by BCFSA, RECA, and FSRA. Learn how we uphold the highest FINTRAC compliance, anti-money laundering standards, and consumer protection across British Columbia, Alberta, and Ontario.",
  keywords:
    "FINTRAC compliance, mortgage broker compliance, BCFSA licensed, RECA licensed, FSRA licensed, anti-money laundering, PCMLTFA, consumer protection mortgage, mortgage security, identity verification mortgage, beneficial ownership",
  openGraph: {
    title: "Compliance, Security & Consumer Protection Hub | Kraft Mortgages",
    description:
      "Fully licensed by BCFSA, RECA, and FSRA. Upholding the highest FINTRAC, anti-money laundering, and consumer protection standards across Canada.",
    url: "https://www.kraftmortgages.ca/compliance-security",
    siteName: "Kraft Mortgages Canada Inc.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliance, Security & Consumer Protection Hub | Kraft Mortgages",
    description:
      "Fully licensed by BCFSA, RECA, and FSRA. Upholding the highest FINTRAC, anti-money laundering, and consumer protection standards across Canada.",
  },
  alternates: {
    canonical: "https://www.kraftmortgages.ca/compliance-security",
  },
};

export default function ComplianceSecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
