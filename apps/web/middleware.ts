import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;

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
