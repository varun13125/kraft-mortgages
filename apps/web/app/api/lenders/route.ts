import { NextRequest, NextResponse } from "next/server";
import { CANADIAN_LENDERS, LenderDetail } from "@/data/canadianLendersData";

export const runtime = "nodejs";
export const revalidate = 300; // 5-minute ISR cache

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const channel = (searchParams.get("channel") || "").trim().toLowerCase();
    const province = (searchParams.get("province") || "").trim().toUpperCase();
    const id = (searchParams.get("id") || "").trim().toLowerCase();
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Single lender lookup by ID
    if (id) {
      const lender = CANADIAN_LENDERS.find(
        (l) => l.id.toLowerCase() === id || l.name.toLowerCase().replace(/\s+/g, "_") === id
      );
      if (!lender) {
        return NextResponse.json(
          { success: false, error: `Lender with ID '${id}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          success: true,
          lender,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Filter collection
    let results: LenderDetail[] = CANADIAN_LENDERS;

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
        total_lenders: CANADIAN_LENDERS.length,
        filtered_count: results.length,
        filters_applied: {
          search: search || null,
          channel: channel || null,
          province: province || null,
          limit: limit || null,
        },
        lenders: results,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("[api/lenders] Error querying Canadian lenders dataset:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to retrieve lender intelligence data.",
      },
      { status: 500 }
    );
  }
}
