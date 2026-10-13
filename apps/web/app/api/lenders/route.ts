import { NextRequest, NextResponse } from "next/server";
import type { LenderDetail } from "@/data/canadianLendersData";
import { LENDERS, scrubContactDetails } from "@/lib/ai/lenderIntelligence";
import { safeEqualSecret } from "@/lib/ai/request-guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Public responses are CDN-cached. `Vary: x-api-key` keeps keyed and anonymous requests in separate
// cache entries, and full (keyed) responses are never cached.
const PUBLIC_HEADERS = {
  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
  "Content-Type": "application/json",
  Vary: "x-api-key",
};
const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "Content-Type": "application/json",
  Vary: "x-api-key",
};

/** Fields withheld from anonymous callers (named BDMs with personal e-mail addresses). */
const REDACTED_FIELDS = ["bdm", "personal contact details in bestFor"];

/**
 * Full records (including `bdm`) only for requests whose `x-api-key` header matches the
 * LENDERS_API_KEY env var. When that env var is unset, every response is redacted (BUG-008).
 */
function hasFullAccess(req: NextRequest): boolean {
  const expected = (process.env.LENDERS_API_KEY || "").trim();
  if (!expected) return false;
  return safeEqualSecret((req.headers.get("x-api-key") || "").trim(), expected);
}

function toPublicLender(lender: LenderDetail): LenderDetail {
  // Keep the field (as an empty string) so consumers that read `bdm` don't break.
  return { ...lender, bdm: "", bestFor: lender.bestFor ? scrubContactDetails(lender.bestFor) : lender.bestFor };
}

export async function GET(req: NextRequest) {
  try {
    const fullAccess = hasFullAccess(req);
    const headers = fullAccess ? PRIVATE_HEADERS : PUBLIC_HEADERS;
    const present = (lender: LenderDetail) => (fullAccess ? lender : toPublicLender(lender));
    const redaction = fullAccess ? {} : { redacted_fields: REDACTED_FIELDS };

    const { searchParams } = req.nextUrl;
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const channel = (searchParams.get("channel") || "").trim().toLowerCase();
    const province = (searchParams.get("province") || "").trim().toUpperCase();
    const id = (searchParams.get("id") || "").trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Single lender lookup by ID
    if (id) {
      const lender = LENDERS.find(
        (l) => l.id.toLowerCase() === id || l.name.toLowerCase().replace(/\s+/g, "_") === id
      );
      if (!lender) {
        return NextResponse.json(
          { success: false, error: `Lender with ID '${id.slice(0, 100)}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          ...redaction,
          lender: present(lender),
        },
        {
          status: 200,
          headers,
        }
      );
    }

    // Filter collection
    let results: LenderDetail[] = LENDERS;

    if (channel) {
      results = results.filter((l) => l.channel.toLowerCase().includes(channel));
    }

    if (province) {
      results = results.filter((l) => l.provinces && l.provinces.includes(province as any));
    }

    if (search) {
      results = results.filter(
        (l) =>
          l.name.toLowerCase().includes(search) ||
          l.channel.toLowerCase().includes(search) ||
          (l.bestFor && l.bestFor.toLowerCase().includes(search)) ||
          (l.specialFeatures && l.specialFeatures.some((f) => f.toLowerCase().includes(search)))
      );
    }

    if (limit && limit > 0) {
      results = results.slice(0, limit);
    }

    return NextResponse.json(
      {
        success: true,
        total_lenders: LENDERS.length,
        filtered_count: results.length,
        filters_applied: {
          search: search || null,
          channel: channel || null,
          province: province || null,
          limit: limit || null,
        },
        ...redaction,
        lenders: results.map(present),
      },
      {
        status: 200,
        headers,
      }
    );
  } catch (err: any) {
    console.error("[api/lenders] Error querying Canadian lenders dataset:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve lender intelligence data.",
      },
      { status: 500 }
    );
  }
}
