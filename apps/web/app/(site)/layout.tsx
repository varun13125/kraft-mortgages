import { headers } from 'next/headers';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-next-url') || headersList.get('x-invoke-path') || '';

  return {
    alternates: {
      canonical: `https://www.kraftmortgages.ca${pathname}`,
    },
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
