import type { Metadata } from 'next';

// /old-design is a deprecated design preview — keep it out of the index.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function OldDesignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
