import { NextRequest, NextResponse } from "next/server";
import { getLiveRatesData } from "@/lib/rates";

export const runtime = "nodejs";
// Next.js ISR revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    const data = getLiveRatesData();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("[api/rates] Error compiling live rate benchmarks:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load live rates",
        benchmarks: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Retain compatibility with legacy POST calls or client queries
    const body = await req.json().catch(() => ({}));
    const data = getLiveRatesData();

    return NextResponse.json(
      {
        ...data,
        requestedProvince: body?.province ?? null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("[api/rates POST] Error compiling live rate benchmarks:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Failed to load live rates",
      },
      { status: 500 }
    );
  }
}
