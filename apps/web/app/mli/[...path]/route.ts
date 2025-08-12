import { NextRequest } from 'next/server';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

// Serve statically copied assets (PDF, images) under /mli/*
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const sub = params.path?.join('/') || '';
    const filePath = join(process.cwd(), 'public', 'mli', sub);
    const data = await readFile(filePath);
    
    // Set appropriate content type
    const ext = sub.split('.').pop()?.toLowerCase();
    const contentType = ext === 'html' ? 'text/html' : 
                       ext === 'css' ? 'text/css' :
                       ext === 'js' ? 'application/javascript' :
                       ext === 'svg' ? 'image/svg+xml' :
                       ext === 'pdf' ? 'application/pdf' :
                       'application/octet-stream';
    
    return new Response(data, {
      headers: { 'Content-Type': contentType }
    });
  } catch (e) {
    console.log('[mli route] File not found:', params.path, e instanceof Error ? e.message : 'Unknown error');
    return new Response('Not found', { status: 404 });
  }
}


