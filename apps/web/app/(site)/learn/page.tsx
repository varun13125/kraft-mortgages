import type { Metadata } from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BUSINESS } from '@/lib/seo/business-config';

// "Under construction" stub: keep it out of the index (it previously inherited the
// homepage title + canonical and was listed in the sitemap) until it has real content.
export const metadata: Metadata = {
  title: 'Learn About Mortgages | Kraft Mortgages',
  description: 'Mortgage education resources from Kraft Mortgages.',
  robots: { index: false, follow: true },
};

export default function Learn() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-900 text-white px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Learn About Mortgages</h1>
          <div className="space-y-6 text-gray-300">
            <p>Our mortgage education center is under construction and will be updated soon with comprehensive guides and resources.</p>
            <p>
              In the meantime, read our latest articles on the{' '}
              <Link href="/blog" className="text-gold-400 hover:underline">Kraft Mortgages blog</Link>{' '}
              or try our <Link href="/calculators" className="text-gold-400 hover:underline">mortgage calculators</Link>.
            </p>
            <p>
              For personalized mortgage guidance, please contact us at{' '}
              <a href={`mailto:${BUSINESS.email}`} className="text-gold-400 hover:underline">{BUSINESS.email}</a>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
