import { getAuth } from "firebase/auth";
import { app } from "./firebase.client";

const BASE = process.env.NEXT_PUBLIC_CREWAPI_BASE_URL || "/crewapi";

async function authHeader(): Promise<HeadersInit> {
  const user = getAuth(app).currentUser;
  const token = user ? await user.getIdToken() : "";
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function apiPost<T>(path: string, body: any, opts: RequestInit = {}): Promise<T> {
  const headers = { "Content-Type": "application/json", ...(await authHeader()), ...(opts.headers||{}) };
  const res = await fetch(`${BASE}${path}`, { method:"POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = { ...(await authHeader()) };
  const res = await fetch(`${BASE}${path}`, { headers, cache:"no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}