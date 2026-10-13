import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const registry: Record<string, any> = {
  'first-time-buyer': dynamic(()=> import('@/content/learn/first-time-buyer.mdx')),
};

// The only guide is a two-line placeholder — noindex until real guides exist
// (it previously inherited the homepage title + canonical).
export const metadata: Metadata = {
  title: 'Mortgage Guide | Kraft Mortgages',
  robots: { index: false, follow: true },
};

export default function LearnPage({ params }: { params: { slug: string } }) {
  const Mdx = registry[params.slug];
  if (!Mdx) return notFound();
  return (
    <>
      <Navigation />
      <main id="main-content" className="prose prose-invert max-w-3xl mx-auto px-6 pt-32 pb-16"><Mdx /></main>
      <Footer />
    </>
  );
}
