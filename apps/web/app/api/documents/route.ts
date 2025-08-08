import { NextRequest } from "next/server";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const url = process.env.FASTAPI_BASE_URL || "http://localhost:8000";
  const r = await fetch(`${url}/documents/upload`, { method: "POST", body: form });
  const data = await r.json();
  return Response.json(data);
}
