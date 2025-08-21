import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { PrefSync } from "@/components/PrefSync";
import { PWA } from "@/components/PWA";
import dynamic from "next/dynamic";

// Dynamically import ChatWidget to avoid hydration issues
const ChatWidget = dynamic(() => import("@/components/ChatWidget/ChatWidget").then(mod => ({ default: mod.ChatWidget })), {
  ssr: false
});

// Dynamically import EmbeddedVoiceAgent
const EmbeddedVoiceAgent = dynamic(() => import("@/components/VoiceAgentWidget/EmbeddedVoiceAgent").then(mod => ({ default: mod.EmbeddedVoiceAgent })), {
  ssr: false
});

export const metadata = {
  title: "Kraft Mortgages Canada | Expert Mortgage Solutions | BC, AB & ON",
  description: "23+ years navigating MLI Select, Construction Financing, and Self-Employed mortgages across BC, AB & ON. Expert mortgage solutions for complex scenarios.",
  keywords: "mortgage broker canada, bc mortgage broker, alberta mortgage rates, ontario mortgage broker, mli select, construction financing, self employed mortgages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <PrefSync />
        {children}
        
        {/* Global AI Chat Widget - Available on every page */}
        <ChatWidget />
        
        {/* Global Voice Agent Widget - Professional voice consultations */}
        <EmbeddedVoiceAgent />
        
        <Analytics />
        <PWA />
      </body>
    </html>
  );
}