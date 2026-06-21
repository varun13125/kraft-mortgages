import { aboutMetadata } from './metadata';

// Organization/LocalBusiness schema is now emitted once in the root app/layout.tsx
// via orgJsonLd(). This layout passes through children and only adds metadata.
export const metadata = aboutMetadata;

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
