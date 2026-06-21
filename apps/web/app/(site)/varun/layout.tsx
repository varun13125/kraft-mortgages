import type { Metadata } from 'next';

// /varun is a personal bio page — not a public marketing surface. Keep it out of the index.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function VarunLayout({ children }: { children: React.ReactNode }) {
  return children;
}
