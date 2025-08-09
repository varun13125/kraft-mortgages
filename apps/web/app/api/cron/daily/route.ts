import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_CREWAPI_BASE_URL || "/crewapi";
  const secret = process.env.CREWAPI_SECRET;
  
  try {
    // First, create a new run in auto mode
    const runResponse = await fetch(`${base}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret || ""
      },
      body: JSON.stringify({
        mode: "auto",
        targetProvinces: ["BC", "AB", "ON"]
      })
    });
    
    if (!runResponse.ok) {
      throw new Error("Failed to create run");
    }
    
    const { runId } = await runResponse.json();
    
    // Then trigger orchestration
    const orchResponse = await fetch(`${base}/orchestrate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": secret || ""
      },
      body: JSON.stringify({ runId })
    });
    
    if (!orchResponse.ok) {
      throw new Error("Failed to orchestrate");
    }
    
    return NextResponse.json({ 
      ok: true, 
      runId,
      message: "Daily content run started"
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}