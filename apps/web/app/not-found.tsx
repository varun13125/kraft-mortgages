import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/seo/business-config';

// Branded 404. Previously Next's bare default 404 (no navigation, no way back
// into the site) was shown for every dead link. Next.js serves this with a 404
// status and adds robots noindex automatically. (No metadata export: keep this
// file compatible with Next 14's not-found conventions.)

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/calculators', label: 'Mortgage Calculators' },
  { href: '/rates', label: "Today's Rates" },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
];

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="min-h-[70vh] flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-xl text-center">
          <p className="text-gold-400 font-mono text-sm tracking-widest mb-4">404</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">We couldn&apos;t find that page</h1>
          <p className="text-gray-400 mb-8">
            The page may have moved. Try one of these instead, or call us at{' '}
            <a href={`tel:${BUSINESS.telephone}`} className="text-gold-400 hover:underline">{BUSINESS.telephoneDisplay}</a>.
          </p>
          <nav aria-label="Helpful links" className="flex flex-wrap justify-center gap-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 transition-colors text-sm"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </main>
      <Footer />
    </>
  );
}
