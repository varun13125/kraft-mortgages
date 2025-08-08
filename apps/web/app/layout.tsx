import "./globals.css";
import Link from "next/link";
import type { Route } from "next";
import { Analytics } from "@/components/Analytics";
import { Nav } from "@/components/Nav";
import { PrefSync } from "@/components/PrefSync";
import { PWA } from "@/components/PWA";
import { Home, Phone, Mail, MapPin, Shield, Award, Building } from "lucide-react";

export const metadata = {
  title: "Kraft Mortgages Canada | AI-Powered Mortgage Solutions",
  description: "Transform your homeownership dreams with Canada's most advanced AI-powered mortgage brokerage. Licensed in BC, Alberta, and Ontario.",
  keywords: "mortgage broker canada, bc mortgage broker, alberta mortgage rates, ontario mortgage broker, ai mortgage calculator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Enhanced Header with Sticky Navigation */}
        <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-700/50 shadow-sm metallic-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 group-hover:from-gold-600 group-hover:to-gold-700 transition-all">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg gradient-text">Kraft Mortgages</div>
                  <div className="text-xs text-gray-400">Canada Inc.</div>
                </div>
              </Link>
              <Nav />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <PrefSync />
          {children}
        </main>

        {/* Enhanced Footer */}
        <footer className="relative metallic-dark border-t border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-bold gradient-text">Kraft Mortgages</div>
                </div>
                <p className="text-sm text-gray-300">
                  Canada&apos;s most advanced AI-powered mortgage brokerage with 23+ years of experience.
                </p>
                <div className="flex gap-2">
                  <Shield className="w-5 h-5 text-gold-500" />
                  <Award className="w-5 h-5 text-gold-500" />
                  <Building className="w-5 h-5 text-gold-500" />
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Calculators</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/calculators/payment" className="text-gray-300 hover:text-gold-400 transition-colors">Payment Calculator</Link></li>
                  <li><Link href="/calculators/affordability" className="text-gray-300 hover:text-gold-400 transition-colors">Affordability</Link></li>
                  <li><Link href="/calculators/renewal" className="text-gray-300 hover:text-gold-400 transition-colors">Renewal Optimizer</Link></li>
                  <li><Link href="/mli-select" className="text-gray-300 hover:text-gold-400 transition-colors">MLI Select</Link></li>
                </ul>
              </div>

              {/* Provinces */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Service Areas</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/provinces/bc" className="text-gray-300 hover:text-gold-400 transition-colors">British Columbia</Link></li>
                  <li><Link href="/provinces/ab" className="text-gray-300 hover:text-gold-400 transition-colors">Alberta</Link></li>
                  <li><Link href="/provinces/on" className="text-gray-300 hover:text-gold-400 transition-colors">Ontario</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Contact</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gold-500 mt-0.5" />
                    <span className="text-gray-300">301-1688 152nd Street<br />Surrey, BC V4A 4N2</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold-500" />
                    <span className="text-gray-300">1-800-KRAFT-MTG</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gold-500" />
                    <span className="text-gray-300">info@kraftmortgages.ca</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Kraft Mortgages Canada Inc. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                  <Link href={"/privacy" as Route} className="text-gray-400 hover:text-gold-400 transition-colors">Privacy Policy</Link>
                  <Link href={"/terms" as Route} className="text-gray-400 hover:text-gold-400 transition-colors">Terms of Service</Link>
                  <Link href={"/compliance" as Route} className="text-gray-400 hover:text-gold-400 transition-colors">Compliance</Link>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">
                Licensed by BCFSA • RECA • FSRAO | Serving BC, Alberta, and Ontario
              </div>
            </div>
          </div>
        </footer>
        
        <Analytics />
        <PWA />
      </body>
    </html>
  );
}
