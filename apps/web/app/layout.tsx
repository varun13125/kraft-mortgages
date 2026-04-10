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

export const metadata = {
  metadataBase: new URL('https://www.kraftmortgages.ca'),
  title: "Kraft Mortgages | Surrey Mortgage Broker | BC, AB & ON",
  description: "Top-rated Surrey mortgage broker with $2B+ funded and 23+ years experience. Expert in MLI Select, construction financing, self-employed mortgages, and private lending. Serving BC, Alberta & Ontario.",
  keywords: "mortgage broker Surrey, Surrey mortgage broker, mortgage broker BC, mortgage broker Alberta, mortgage broker Ontario, MLI Select, construction financing, self-employed mortgages, private lending, best mortgage broker Surrey",
  alternates: {
    canonical: 'https://www.kraftmortgages.ca',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
