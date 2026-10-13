import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import { OG_DEFAULTS } from '@/lib/seo/og';

// The page is a client component (form state), so its metadata lives here.
// Before this layout existed /business-funding (a sitemap service hub) inherited
// the homepage title/description and had no canonical of its own.
const title = 'Business Funding & Working Capital | Kraft Mortgages';
const description =
  'Small business funding through Kraft Mortgages: working capital, business lines of credit, equipment financing and growth loans. Submit a quick funding request online.';
const url = 'https://www.kraftmortgages.ca/business-funding';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...OG_DEFAULTS, title, description, url },
};

export default function BusinessFundingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
