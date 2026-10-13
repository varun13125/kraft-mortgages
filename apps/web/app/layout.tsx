import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { PrefSync } from "@/components/PrefSync";
import { PWA } from "@/components/PWA";
import { MotionProvider } from "@/components/MotionProvider";
import { JsonLd } from "@/components/SEO/JsonLd";
import { orgJsonLd } from "@/lib/seo/jsonld";
import { BUSINESS } from "@/lib/seo/business-config";
import dynamic from "next/dynamic";

// Dynamically import ChatWidget to avoid hydration issues
const ChatWidget = dynamic(() => import("@/components/ChatWidget/ChatWidget").then(mod => ({ default: mod.ChatWidget })), {
  ssr: false
});

// Dynamically import Thinkrr Voice AI Dual-Agent Widget
const ThinkrrVoiceWidget = dynamic(() => import("@/components/ThinkrrVoiceWidget").then(mod => ({ default: mod.ThinkrrVoiceWidget })), {
  ssr: false
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.kraftmortgages.ca'),
  title: 'Kraft Mortgages Canada Inc. | Mortgage Broker Surrey',
  description: 'Licensed Canadian mortgage brokerage firm providing optimized financing strategies across BC, AB, and ON. Specializing in CMHC MLI Select and commercial draw systems.',
  keywords: "mortgage broker Surrey, Surrey mortgage broker, mortgage broker BC, mortgage broker Alberta, mortgage broker Ontario, MLI Select, construction financing, self-employed mortgages, private lending, best mortgage broker Surrey",
  // NOTE: no `alternates.canonical` here on purpose. A root-level canonical is
  // inherited by every page that doesn't set its own, which made dozens of
  // calculator/MLI pages declare the HOMEPAGE as their canonical. The homepage
  // sets its own canonical in app/(site)/page.tsx; every other page must too.
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
    // No `url` here: it would be inherited as og:url = homepage by every page
    // without its own openGraph. Pages set their own og:url.
    siteName: 'Kraft Mortgages',
    locale: 'en_CA',
    type: 'website',
    images: [{ url: BUSINESS.ogImageUrl, width: 1200, height: 630, alt: BUSINESS.name }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className="dark overflow-x-hidden max-w-full">
      <head>
        {/* (Removed unused preconnects to fonts.googleapis.com / fonts.gstatic.com /
            vercel.live — no Google Fonts or Vercel toolbar are loaded, so they only
            opened idle connections that competed with critical requests.) */}
        <JsonLd data={orgJsonLd()} />
      </head>
      <body className="min-h-screen overflow-x-hidden w-full max-w-full">
        <MotionProvider>
        <div className="relative min-h-screen overflow-x-hidden w-full max-w-full bg-slate-950 text-gray-100 antialiased selection:bg-gold-500/30 selection:text-gold-200">
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

        {/* Global Thinkrr Voice AI Dual-Agent (English & Hindi) WebRTC Widget */}
        <ThinkrrVoiceWidget />
        </MotionProvider>

        <Analytics />
        <VercelAnalytics />
        <PWA />
      </body>
    </html>
  );
}
