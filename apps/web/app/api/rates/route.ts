import { NextRequest, NextResponse } from "next/server";
import { loadCurrentRates } from "@/lib/ratesSource";

export const runtime = "nodejs";
// Next.js ISR revalidation every 5 minutes (300 seconds)
export const revalidate = 300;

async function fetchRatesWithRemoteFallback() {
  const data = await loadCurrentRates();
  if (!data) throw new Error("No rates source available");
  return data;
}

export async function GET() {
  try {
    const data = await fetchRatesWithRemoteFallback();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("[api/rates] Error compiling live rate benchmarks:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load live rates",
        benchmarks: null,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const data = await fetchRatesWithRemoteFallback();
    const requestedProvince = ["BC", "AB", "ON"].includes(body?.province) ? body.province : null;

    return NextResponse.json(
      {
        ...data,
        requestedProvince,
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
    console.error("[api/rates POST] Error compiling live rate benchmarks:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load live rates",
      },
      { status: 500 }
    );
  }
}
