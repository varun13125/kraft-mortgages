import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { PrefSync } from "@/components/PrefSync";
import { PWA } from "@/components/PWA";
import { JsonLd } from "@/components/SEO/JsonLd";
import { orgJsonLd } from "@/lib/seo/jsonld";
import { BUSINESS } from "@/lib/seo/business-config";
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
    images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="dark">
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vercel.live" />
        <JsonLd data={orgJsonLd()} />
      </head>
      <body className="min-h-screen">
        <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-gray-100 antialiased selection:bg-gold-500/30 selection:text-gold-200">
          {/* Unified Site-wide Animated Background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 subtle-grid-bg opacity-70" />

            {/* Floating Ambient Glowing Gradients */}
            <div className="glowing-mesh-container">
              <div className="glowing-mesh-blob blob-gold-1 opacity-[0.08]" />
              <div className="glowing-mesh-blob blob-gold-2 opacity-[0.07]" />
              <div className="glowing-mesh-blob blob-gold-3 opacity-[0.06]" />
              <div className="glowing-mesh-blob blob-gold-4 opacity-[0.08]" />
            </div>

            {/* Sweeping Stage Spotlights */}
            <div className="spotlight-overlay">
              <div className="spotlight spotlight-left" />
              <div className="spotlight spotlight-mid" />
              <div className="spotlight spotlight-right" />
            </div>
          </div>

          <div className="relative z-10">
            <PrefSync />
            {children}
          </div>
        </div>

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
