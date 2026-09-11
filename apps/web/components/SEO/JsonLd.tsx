import React from 'react';

/**
 * Renders a JSON-LD script tag. Server Component safe (no "use client").
 * Usage: <JsonLd data={orgJsonLd()} />
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
