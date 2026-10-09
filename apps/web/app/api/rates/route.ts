import { NextRequest, NextResponse } from "next/server";
import { getLiveRatesData, formatLiveRatesData } from "@/lib/rates";
import { RawRatesFeed } from "@/types/rates";

export const runtime = "nodejs";
// Next.js ISR revalidation every 5 minutes (300 seconds)
export const revalidate = 300;

const REMOTE_FEED_URL = process.env.RATES_FEED_URL || "https://blog.kraftmortgages.ca/current_rates.json";

async function fetchRatesWithRemoteFallback() {
  if (REMOTE_FEED_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(REMOTE_FEED_URL, {
        signal: controller.signal,
        next: { revalidate: 300 },
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const raw = (await res.json()) as RawRatesFeed;
        if (raw && raw.rate_benchmarks) {
          return formatLiveRatesData(raw, REMOTE_FEED_URL);
        }
      }
    } catch {
      // Fall through to local file or embedded snapshot
    }
  }
  return getLiveRatesData();
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
        error: err?.message || "Failed to load live rates",
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

    return NextResponse.json(
      {
        ...data,
        requestedProvince: body?.province ?? null,
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
        error: err?.message || "Failed to load live rates",
      },
      { status: 500 }
    );
  }
}
