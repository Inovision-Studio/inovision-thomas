import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Edge guard: any /admin/* except /admin/login needs a valid session cookie.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) return NextResponse.next();
  const token = req.cookies.get("iv_session")?.value;
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me"));
      return NextResponse.next();
    } catch {}
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/admin/:path*"] };
