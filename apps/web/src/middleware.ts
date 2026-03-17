import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth"];
const SESSION_COOKIE = "session_id";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionId) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: { Cookie: `${SESSION_COOKIE}=${sessionId}` },
      cache: "no-store",
    });
    const user = await res.json();
    if (!user) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
