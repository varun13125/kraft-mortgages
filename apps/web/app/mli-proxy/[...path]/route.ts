import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://www.kraftmortgages.ca';
// Serve the built mli-select-complete app under /mli by proxying static assets and pages

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subPath = params.path?.join('/') || '';
  // Map to /mli-select-complete build structure (public and src/app exported assets)
  // For simplicity, proxy only public assets and the PDF guide
  const candidates = [
    `/mli-select-complete/public/${subPath}`,
    `/mli-select-complete/public/${subPath}/index.html`,
  ];
  for (const p of candidates) {
    const url = `${origin}${p}`;
    const r = await fetch(url);
    if (r.ok) {
      return new Response(r.body, { headers: r.headers });
    }
  }
  return new Response('Not found', { status: 404 });
}


