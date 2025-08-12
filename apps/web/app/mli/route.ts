import { NextRequest } from 'next/server';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

// Serve the main MLI index page at /mli
export async function GET(req: NextRequest) {
  try {
    const filePath = join(process.cwd(), 'public', 'mli', 'index.html');
    const data = await readFile(filePath);
    return new Response(data, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (e) {
    console.log('[mli route] Index file not found:', e instanceof Error ? e.message : 'Unknown error');
    return new Response('MLI microsite not available', { status: 404 });
  }
}