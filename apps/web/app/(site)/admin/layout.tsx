import type { Metadata } from 'next';

// /admin and all nested surfaces (analytics, blog mgmt, rates) are internal — keep them out of the index.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
