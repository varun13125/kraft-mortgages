import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// /provinces/{bc,ab,on} are not in the sitemap or the live navigation (only the
// unused components/Nav.tsx and /old-design link here). AB and ON are two-line
// stubs and BC has unreviewed content (expired BC HOME program, unverified stats),
// so keep the section out of the index until it is rebuilt. Previously these pages
// had no metadata at all and inherited the homepage title + canonical, and had no
// navigation (dead ends).
export const metadata: Metadata = {
  title: 'Provincial Mortgage Guidance | Kraft Mortgages',
  description: 'Mortgage guidance for British Columbia, Alberta and Ontario from Kraft Mortgages.',
  robots: { index: false, follow: true },
};

export default function ProvincesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
