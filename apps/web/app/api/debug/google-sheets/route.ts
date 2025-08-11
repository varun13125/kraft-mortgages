import { NextResponse } from 'next/server';
import { getBlogPosts, getBlogPostsWithDiagnostics } from '@/lib/googleSheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const info: any = {
    sheetIdSet: !!process.env.GOOGLE_SHEET_ID,
    sheetId: process.env.GOOGLE_SHEET_ID || 'DEFAULT:1fz1DIUq7gerTUC9kWFXZovbJUFbp-dr5e3Rw005J2NU',
  };
  try {
    const diag = await getBlogPostsWithDiagnostics();
    info.ok = true;
    info.rawCount = diag.rawCount;
    info.filteredCount = diag.filteredCount;
    info.sample = diag.sample;
    return NextResponse.json(info);
  } catch (e: any) {
    info.ok = false;
    info.error = e?.message || String(e);
    return NextResponse.json(info, { status: 500 });
  }
}


