import { NextRequest } from 'next/server';
import { join } from 'node:path';
import { readFile, access } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { path?: string[] } }) {
  const subPath = params.path?.join('/') ?? '';
  const baseDir = join(process.cwd(), 'public', 'mli');

  // Build candidate file paths to try in order
  const candidates: string[] = [];
  if (!subPath) {
    candidates.push(join(baseDir, 'index.html'));
  } else {
    const abs = join(baseDir, subPath);
    candidates.push(abs);
    // If requesting a directory (no extension or trailing slash), try index.html
    if (!subPath.includes('.') || subPath.endsWith('/')) {
      const dir = subPath.endsWith('/') ? abs : abs + '/';
      candidates.push(join(dir, 'index.html'));
    }
  }

  // Try to serve the first existing candidate
  for (const filePath of candidates) {
    try {
      await access(filePath);
      const data = await readFile(filePath);
      const ext = (filePath.split('.').pop() || '').toLowerCase();
      const contentType =
        ext === 'html' ? 'text/html; charset=utf-8' :
        ext === 'css' ? 'text/css' :
        ext === 'js' ? 'application/javascript' :
        ext === 'mjs' ? 'application/javascript' :
        ext === 'json' ? 'application/json' :
        ext === 'svg' ? 'image/svg+xml' :
        ext === 'png' ? 'image/png' :
        ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
        ext === 'webp' ? 'image/webp' :
        ext === 'ico' ? 'image/x-icon' :
        ext === 'pdf' ? 'application/pdf' :
        ext === 'woff' ? 'font/woff' :
        ext === 'woff2' ? 'font/woff2' :
        ext === 'ttf' ? 'font/ttf' :
        ext === 'eot' ? 'application/vnd.ms-fontobject' :
        ext === 'map' ? 'application/json' :
        'application/octet-stream';

      return new Response(data, { headers: { 'Content-Type': contentType } });
    } catch {
      // Try next candidate
    }
  }

  // Not found; send users to the program hub instead of a 404 for nicer UX
  return Response.redirect(new URL('/mli-select', req.url), 302);
}


