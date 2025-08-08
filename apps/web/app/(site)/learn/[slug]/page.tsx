import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const registry: Record<string, any> = {
  'first-time-buyer': dynamic(()=> import('@/content/learn/first-time-buyer.mdx')),
};

export default function LearnPage({ params }: { params: { slug: string } }) {
  const Mdx = registry[params.slug];
  if (!Mdx) return notFound();
  return <div className="prose max-w-3xl"><Mdx /></div>;
}
