import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { PrefSync } from "@/components/PrefSync";
import { PWA } from "@/components/PWA";
import dynamic from "next/dynamic";

// Dynamically import ChatWidget to avoid hydration issues
const ChatWidget = dynamic(() => import("@/components/ChatWidget/ChatWidget").then(mod => ({ default: mod.ChatWidget })), {
  ssr: false
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kraftmortgages.ca'),
  title: 'Kraft Mortgages Canada Inc. | Mortgage Broker Surrey',
  description: 'Licensed Canadian mortgage brokerage firm providing optimized financing strategies across BC, AB, and ON. Specializing in CMHC MLI Select and commercial draw systems.',
  keywords: "mortgage broker Surrey, Surrey mortgage broker, mortgage broker BC, mortgage broker Alberta, mortgage broker Ontario, MLI Select, construction financing, self-employed mortgages, private lending, best mortgage broker Surrey",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca',
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Kraft Mortgages Canada Inc. | Mortgage Broker Surrey',
    description: 'Licensed Canadian mortgage brokerage firm providing optimized financing strategies across BC, AB, and ON. Specializing in CMHC MLI Select and commercial draw systems.',
    url: 'https://www.kraftmortgages.ca',
    siteName: 'Kraft Mortgages',
    locale: 'en_CA',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Corrected JSON-LD Graph Matrix removing duplicate semantic definitions (Item 4)
  const corporateSchemaGraph = {
    "@context": "https://schema.org",
    "@type": "MortgageBroker",
    "name": "Kraft Mortgages Canada Inc.",
    "url": "https://www.kraftmortgages.ca",
    "logo": "https://www.kraftmortgages.ca/assets/logo.png",
    "image": ["https://www.kraftmortgages.ca/assets/hero.jpg"],
    "telephone": "+1-604-593-1550",
    "priceRange": "Contact for rates",
    "foundingDate": "2014-01-01",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-604-593-1550",
      "contactType": "Customer Service",
      "areaServed": ["BC", "AB", "ON"],
      "availableLanguage": ["English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "301 1688 152nd Street",
      "addressLocality": "Surrey",
      "addressRegion": "BC",
      "postalCode": "V4A 4N2",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.0326,
      "longitude": -122.8012
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/kraftmortgages",
      "https://www.linkedin.com/company/kraft-mortgages"
    ],
    "foundingMember": [
      {
        "@type": "Person",
        "name": "Varun Chaudhry",
        "jobTitle": "President & Broker",
        "knowsAbout": "BCFSA License #SR220230"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(corporateSchemaGraph) }}
        />
      </head>
      <body className="min-h-screen">
        <PrefSync />
        {children}

        {/* Global AI Chat Widget - Available on every page */}
        <ChatWidget />

        {/* Voice Agent Widget removed - will be replaced with new implementation */}

        <Analytics />
        <VercelAnalytics />
        <PWA />
      </body>
    </html>
  );
}
