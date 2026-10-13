import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
// Reads the query string, so the route is dynamic (declaring `revalidate` while reading request.url
// made `next build` log DYNAMIC_SERVER_USAGE, BUG-052). Responses are still cached at the CDN via
// Cache-Control, and the remote matrix fetch is cached for an hour by the Next data cache.
export const dynamic = "force-dynamic";

const REMOTE_MATRIX_URL = process.env.CRITERIA_MATRIX_URL || "https://blog.kraftmortgages.ca/underwriting_criteria_matrix.json";
const CACHE_HEADERS = { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" };

function loadLocalMatrix(): any {
  // Repo-relative snapshot only (the cwd is the repo root or apps/web depending on how it runs).
  const candidatePaths = [
    path.resolve(process.cwd(), "apps/web/data/underwriting_criteria_matrix.json"),
    path.resolve(process.cwd(), "data/underwriting_criteria_matrix.json"),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      }
    } catch {
      // Continue searching
    }
  }
  return { lenders: {} };
}

export async function GET(req: NextRequest) {
  try {
    const lenderQuery = (req.nextUrl.searchParams.get("lender") || "").trim().toLowerCase();

    let matrixData: any = null;

    let sourceUsed = "local";
    if (REMOTE_MATRIX_URL) {
      try {
        const res = await fetch(REMOTE_MATRIX_URL, {
          signal: AbortSignal.timeout(3500),
          next: { revalidate: 3600 },
        });
        if (res.ok) {
          matrixData = await res.json();
          sourceUsed = REMOTE_MATRIX_URL;
        }
      } catch {
        // Fall through to local file
      }
    }

    if (!matrixData || !matrixData.lenders) {
      matrixData = loadLocalMatrix();
      sourceUsed = "local_snapshot";
    }

    const lenders = matrixData.lenders || {};

    if (!lenderQuery) {
      return NextResponse.json(
        {
          success: true,
          source: sourceUsed,
          generated_utc: matrixData.generated_utc,
          total_lenders: Object.keys(lenders).length,
          lenders,
        },
        { headers: CACHE_HEADERS }
      );
    }

    const matches: Record<string, any> = {};
    for (const [name, val] of Object.entries(lenders)) {
      if (name.toLowerCase().includes(lenderQuery)) {
        matches[name] = val;
      }
    }

    return NextResponse.json(
      {
        success: true,
        query: lenderQuery,
        matches_count: Object.keys(matches).length,
        lenders: matches,
      },
      { headers: CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("[api/criteria] Error fetching criteria matrix:", err instanceof Error ? err.message : err);
    return NextResponse.json({ success: false, error: "Failed to load criteria matrix." }, { status: 500 });
  }
}
