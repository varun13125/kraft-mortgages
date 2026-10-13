/**
 * Twilio webhook signature validation (X-Twilio-Signature) without the twilio SDK.
 *
 * Algorithm (https://www.twilio.com/docs/usage/security#validating-requests):
 *   base64( HMAC-SHA1( authToken, fullUrl + concat(sortedKey + value for each POST param) ) )
 *
 * Because the exact public URL Twilio called can differ from req.url behind proxies,
 * several candidate URLs are tried (req.url, forwarded host/proto, configured site URLs).
 */
import crypto from "crypto";
import type { NextRequest } from "next/server";

function computeSignature(authToken: string, url: string, params: Record<string, string>): string {
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);
  return crypto.createHmac("sha1", authToken).update(Buffer.from(data, "utf-8")).digest("base64");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

function candidateUrls(req: NextRequest): string[] {
  const urls = new Set<string>();
  const reqUrl = new URL(req.url);
  const pathAndQuery = `${reqUrl.pathname}${reqUrl.search}`;
  urls.add(req.url);

  const fwdHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const fwdProto = (req.headers.get("x-forwarded-proto") || "https").split(",")[0].trim();
  if (fwdHost) urls.add(`${fwdProto}://${fwdHost}${pathAndQuery}`);

  for (const base of [process.env.NEXT_PUBLIC_SITE_URL, process.env.NEXTAUTH_URL]) {
    if (base) urls.add(`${base.replace(/\/+$/, "")}${pathAndQuery}`);
  }
  return Array.from(urls);
}

/**
 * Returns true only when TWILIO_AUTH_TOKEN is configured and the request carries a
 * valid X-Twilio-Signature for one of the candidate URLs. Fails closed otherwise.
 */
export function isValidTwilioRequest(req: NextRequest, params: Record<string, string>): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = req.headers.get("x-twilio-signature");
  if (!authToken || !signature) return false;

  return candidateUrls(req).some((url) => safeEqual(computeSignature(authToken, url, params), signature));
}

/** Converts a FormData body into the flat string map Twilio signs. */
export function formDataToParams(form: FormData): Record<string, string> {
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === "string") params[key] = value;
  });
  return params;
}
