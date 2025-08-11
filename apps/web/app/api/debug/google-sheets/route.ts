import { NextResponse } from 'next/server';
import { getBlogPosts, getBlogPostsWithDiagnostics } from '@/lib/googleSheets';
import { google } from 'googleapis';

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

    // Low-level probes
    const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1fz1DIUq7gerTUC9kWFXZovbJUFbp-dr5e3Rw005J2NU';
    const ranges = ['Blogs!A:AF','Blog!A:AF','Posts!A:AF','Sheet1!A:AF','A:AF'];
    info.probes = {};

    // Probe: API key
    if (process.env.GOOGLE_API_KEY) {
      for (const r of ranges) {
        try {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(r)}?key=${process.env.GOOGLE_API_KEY}`;
          const res = await fetch(url, { cache: 'no-store' as any });
          info.probes[`apikey:${r}`] = { status: res.status };
          if (res.ok) {
            const j = await res.json();
            info.probes[`apikey:${r}`].length = j?.values?.length || 0;
            if (j?.values?.length) {
              info.probes[`apikey:${r}`].firstRow = j.values[0];
            }
          } else {
            info.probes[`apikey:${r}`].errorText = await res.text();
          }
        } catch (e: any) {
          info.probes[`apikey:${r}`] = { error: e?.message || String(e) };
        }
      }
    } else {
      info.probes.apikey = 'GOOGLE_API_KEY not set';
    }

    // Probe: Service account
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
      const sheets = google.sheets({ version: 'v4', auth });
      for (const r of ranges) {
        try {
          const resp = await sheets.spreadsheets.values.get({ spreadsheetId, range: r });
          const vals = resp.data.values as string[][] | undefined;
          info.probes[`svc:${r}`] = { ok: true, length: vals?.length || 0, firstRow: vals?.[0] };
        } catch (e: any) {
          info.probes[`svc:${r}`] = { ok: false, error: e?.message || String(e) };
        }
      }
    } catch (e: any) {
      info.probes.serviceAccountInitError = e?.message || String(e);
    }
    return NextResponse.json(info);
  } catch (e: any) {
    info.ok = false;
    info.error = e?.message || String(e);
    return NextResponse.json(info, { status: 500 });
  }
}


