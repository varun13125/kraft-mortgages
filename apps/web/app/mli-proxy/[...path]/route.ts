// Next.js API route for serving static MLI microsite exports
// This is used by the rewrites in next.config.mjs to serve /mli-select/:path* routes
// All static assets from mli-select-complete/out are copied to public/mli-select during build
import { join } from 'path';
import { readFile } from 'fs/promises';
import { stat } from 'fs/promises';
import { NextResponse } from 'next/server';

// MIME types for common files
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
};

// Helper to get MIME type
function getMimeType(filePath: string): string {
  const ext = '.' + filePath.split('.').pop()?.toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export async function GET(request: Request, { params }: { params: { path: string[] } }) {
  try {
    // Get the path segments and join them properly
    const pathSegments = params.path || [];
    const filePath = pathSegments.join('/');
    
    // Construct the full path to the file in public/mli-select
    // This serves files from apps/web/public/mli-select
    const fullPath = join(process.cwd(), 'public', 'mli-select', filePath);
    
    console.log('[mli-proxy] Request for:', filePath);
    console.log('[mli-proxy] Full path:', fullPath);
    
    // Check if file exists and get stats
    let fileStat;
    try {
      fileStat = await stat(fullPath);
    } catch (statError) {
      console.log('[mli-proxy] File not found, trying index.html');
      // If file doesn't exist, try index.html (for directories)
      const indexPath = join(fullPath, 'index.html');
      try {
        await stat(indexPath);
        // Redirect to serve index.html
        return GET(request, { params: { path: [...pathSegments, 'index.html'] } });
      } catch (indexError) {
        console.log('[mli-proxy] index.html not found either');
        return new NextResponse('File not found', { status: 404 });
      }
    }
    
    // If it's a directory, try to serve index.html
    if (fileStat.isDirectory()) {
      const indexPath = join(fullPath, 'index.html');
      try {
        await stat(indexPath);
        // Redirect to serve index.html
        return GET(request, { params: { path: [...pathSegments, 'index.html'] } });
      } catch (indexError) {
        console.log('[mli-proxy] Directory requested but no index.html found');
        return new NextResponse('Directory listing not available', { status: 404 });
      }
    }
    
    // Read and serve the file
    const fileBuffer = await readFile(fullPath);
    const mimeType = getMimeType(fullPath);
    
    console.log('[mli-proxy] Serving file with MIME type:', mimeType);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // 1 year for static assets
      },
    });
  } catch (error) {
    console.error('[mli-proxy] Error serving file:', (error as Error)?.message || error);
    
    // Fallback: try to serve index.html for any error (this handles client-side routing)
    if (params.path && params.path.length > 0) {
      return GET(request, { params: { path: ['index.html'] } });
    }
    
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Handle other HTTP methods if needed
export async function HEAD(_request: Request, _params: { params: { path: string[] } }) {
  // Implement HEAD request handling if needed
  return new NextResponse(null, { status: 405, headers: { 'Allow': 'GET' } });
}

export async function OPTIONS(_request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}