import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Separate marketing pages served from their own subdomain, routed to a
// path inside this same app — add an entry here when a new subdomain
// (e.g. links.movibody.com) needs to be pointed at a different page.
const HOST_ROUTES: Record<string, string> = {
  "links.movibody.com": "/links",
  "newidentity.movibody.com": "/newidentity",
};

export async function proxy(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").split(":")[0];
  const targetPath = HOST_ROUTES[hostname];

  if (targetPath && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
