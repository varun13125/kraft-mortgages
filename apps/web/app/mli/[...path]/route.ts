import { NextRequest } from 'next/server';
import { join } from 'node:path';
import { readFile, access } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

// Serve statically copied assets (PDF, images) under /mli/*
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const sub = params.path?.join('/') || '';
    const filePath = join(process.cwd(), 'public', 'mli', sub);
    
    console.log('[mli route] Attempting to serve:', filePath);
    
    // Check if file exists first
    await access(filePath);
    const data = await readFile(filePath);
    
    // Set appropriate content type
    const ext = sub.split('.').pop()?.toLowerCase();
    const contentType = ext === 'html' ? 'text/html' : 
                       ext === 'css' ? 'text/css' :
                       ext === 'js' ? 'application/javascript' :
                       ext === 'svg' ? 'image/svg+xml' :
                       ext === 'pdf' ? 'application/pdf' :
                       'application/octet-stream';
    
    console.log('[mli route] Successfully serving:', sub, 'as', contentType);
    return new Response(data, {
      headers: { 'Content-Type': contentType }
    });
  } catch (e) {
    console.log('[mli route] File not found:', params.path, 'Error:', e instanceof Error ? e.message : 'Unknown error');
    
    // For now, redirect to mli-select hub if file not found
    return Response.redirect(new URL('/mli-select', req.url), 302);
  }
}


