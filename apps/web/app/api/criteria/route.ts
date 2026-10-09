import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const revalidate = 3600;

const REMOTE_MATRIX_URL = process.env.CRITERIA_MATRIX_URL || "https://blog.kraftmortgages.ca/underwriting_criteria_matrix.json";

function loadLocalMatrix(): any {
  const candidatePaths = [
    path.resolve(process.cwd(), "apps/web/data/underwriting_criteria_matrix.json"),
    path.resolve(process.cwd(), "data/underwriting_criteria_matrix.json"),
    path.resolve(process.cwd(), "../Hermes Agent/data/underwriting_criteria_matrix.json"),
    "c:\\Users\\User\\Documents\\App development\\Hermes Agent\\data\\underwriting_criteria_matrix.json",
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
    const { searchParams } = new URL(req.url);
    const lenderQuery = (searchParams.get("lender") || "").trim().toLowerCase();

    let matrixData: any = null;

    let sourceUsed = "local";
    if (REMOTE_MATRIX_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(REMOTE_MATRIX_URL, {
          signal: controller.signal,
          next: { revalidate: 3600 },
        });
        clearTimeout(timeoutId);
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
      return NextResponse.json({
        success: true,
        source: sourceUsed,
        generated_utc: matrixData.generated_utc,
        total_lenders: Object.keys(lenders).length,
        lenders,
      });
    }

    const matches: Record<string, any> = {};
    for (const [name, val] of Object.entries(lenders)) {
      if (name.toLowerCase().includes(lenderQuery)) {
        matches[name] = val;
      }
    }

    return NextResponse.json({
      success: true,
      query: lenderQuery,
      matches_count: Object.keys(matches).length,
      lenders: matches,
    });
  } catch (err: any) {
    console.error("[api/criteria] Error fetching criteria matrix:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
