import React from 'react';
import { cityServiceJsonLd } from '@/lib/seo/jsonld';

/**
 * Renders a city-specific Service schema for a mortgage-broker-{city} page.
 * Server Component safe. The node REFERENCES the org by @id (does not redefine it),
 * which fixes the local-SEO fragmentation flagged in the audit.
 *
 * Usage in a city layout:
 *   <CityServiceJsonLd cityName="Surrey" provinceName="BC" description="..." />
 */
export function CityServiceJsonLd({
  cityName,
  provinceName,
  description,
}: {
  cityName: string;
  provinceName: string;
  description: string;
}) {
  const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const data = cityServiceJsonLd({
    cityName,
    provinceName,
    url: `https://www.kraftmortgages.ca/mortgage-broker-${slug}`,
    description,
  });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
