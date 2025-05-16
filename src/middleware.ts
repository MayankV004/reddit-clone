import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if ((path.startsWith("/login") || path.startsWith("/signup")) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if ((path.startsWith("/profile") || path.startsWith("/r/")) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", encodeURI(path));
    return NextResponse.redirect(loginUrl);
  }
  if (path.startsWith("/api/communities") && req.method === "POST" && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/profile/:path*",
    "/r/:path*",
    "/login",
    "/signup",
    "/api/communities",
  ],
};
