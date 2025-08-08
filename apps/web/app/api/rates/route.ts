import { NextRequest } from "next/server";

export const runtime = "nodejs"; // allow fetch & networking

export async function POST(req: NextRequest) {
  const body = await req.json();
  const province = body?.province ?? null;
  const url = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
  const r = await fetch(`${url}/rates`, { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ province }) });
  const data = await r.json();
  return Response.json(data);
}
