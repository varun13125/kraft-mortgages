import { NextRequest } from 'next/server';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const dynamic = 'force-dynamic';

// Serve statically copied assets (PDF, images) under /mli/*
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const sub = params.path?.join('/') || '';
    const filePath = join(process.cwd(), 'apps', 'web', 'public', 'mli', sub);
    const data = await readFile(filePath);
    return new Response(data);
  } catch {
    return new Response('Not found', { status: 404 });
  }
}


