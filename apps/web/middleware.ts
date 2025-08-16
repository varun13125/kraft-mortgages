import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // MLI Select routes are now handled by Next.js pages
  // No special middleware needed for /mli-select/* routes
  
  return NextResponse.next();
}
