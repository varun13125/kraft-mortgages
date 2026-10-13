import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Constant-time string compare (Edge runtime has no crypto.timingSafeEqual).
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

/**
 * /admin/* pages are Server Components that read leads, KPIs and rate snapshots
 * straight from the database with NO auth check (Firebase client auth is not
 * visible to the server). Protect them with HTTP Basic Auth.
 *
 * Env: ADMIN_BASIC_AUTH_USER + ADMIN_BASIC_AUTH_PASSWORD.
 * If they are not set, /admin is DISABLED in production (fail closed) and open
 * in local development.
 */
function guardAdmin(req: NextRequest): NextResponse | null {
  const user = process.env.ADMIN_BASIC_AUTH_USER;
  const pass = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!user || !pass) {
    if (process.env.NODE_ENV !== "production") return null;
    return new NextResponse(
      "Admin area disabled: set ADMIN_BASIC_AUTH_USER and ADMIN_BASIC_AUTH_PASSWORD to enable it.",
      { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } }
    );
  }

  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6).trim());
      const idx = decoded.indexOf(":");
      if (idx >= 0) {
        const u = decoded.slice(0, idx);
        const p = decoded.slice(idx + 1);
        // Evaluate both to keep timing uniform
        const okUser = safeEqual(u, user);
        const okPass = safeEqual(p, pass);
        if (okUser && okPass) return null;
      }
    } catch {
      // malformed header - fall through to challenge
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kraft Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const denied = guardAdmin(req);
    if (denied) return denied;
  }

  // Redirect varun.kraftmortgages.ca/ to /varun
  if (host.startsWith('varun.kraftmortgages.ca') && pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/varun';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

// Matcher excludes static assets, _next, and api routes
export const config = {
  matcher: '/((?!_next|api|.*\\..*).*)',
};
