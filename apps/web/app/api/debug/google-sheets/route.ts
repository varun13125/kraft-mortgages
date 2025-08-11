import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/googleSheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const info: any = {
    sheetIdSet: !!process.env.GOOGLE_SHEET_ID,
    sheetId: process.env.GOOGLE_SHEET_ID || 'DEFAULT:1fz1DIUq7gerTUC9kWFXZovbJUFbp-dr5e3Rw005J2NU',
  };
  try {
    const posts = await getBlogPosts();
    info.ok = true;
    info.count = posts.length;
    info.sample = posts[0] ? {
      slug: (posts[0] as any).slug,
      title: (posts[0] as any).title,
      status: (posts[0] as any).status,
      publishedat: (posts[0] as any).publishedat,
    } : null;
    return NextResponse.json(info);
  } catch (e: any) {
    info.ok = false;
    info.error = e?.message || String(e);
    return NextResponse.json(info, { status: 500 });
  }
}


