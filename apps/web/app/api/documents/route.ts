import { NextRequest } from "next/server";
import { getBearerToken, verifyFirebaseToken } from "@/lib/auth";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req: NextRequest) {
  // SECURITY: previously an unauthenticated upload relay. Mortgage documents are
  // sensitive PII - require a signed-in Firebase user.
  const token = getBearerToken(req);
  if (!token) return Response.json({ error: "Authentication required" }, { status: 401 });
  try {
    await verifyFirebaseToken(token);
  } catch {
    return Response.json({ error: "Invalid authentication token" }, { status: 401 });
  }

  const url = process.env.FASTAPI_BASE_URL;
  if (!url) {
    // The old default (http://localhost:8000) can never work on Vercel.
    return Response.json({ error: "Document service not configured" }, { status: 503 });
  }

  const declared = Number(req.headers.get("content-length") || 0);
  if (declared > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "File too large" }, { status: 413 });
  }

  try {
    const form = await req.formData();
    const r = await fetch(`${url}/documents/upload`, { method: "POST", body: form });
    const data = await r.json().catch(() => ({ error: "Invalid response from document service" }));
    return Response.json(data, { status: r.ok ? 200 : 502 });
  } catch (error) {
    console.error("[documents] upload relay failed:", error instanceof Error ? error.message : error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
