import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define paths that are protected (require authentication)
  const protectedPaths = ["/submit", "/profile", "/settings"];
  const isPathProtected = protectedPaths.some((protectedPath) => 
    path.startsWith(protectedPath)
  );
  
  // Get the token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If the path is protected and the user doesn't have a token
  if (isPathProtected && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", encodeURI(path));
    return NextResponse.redirect(url);
  }

  // Define auth paths
  const authPaths = ["/login", "/signup"];
  const isAuthPath = authPaths.some((authPath) => path.startsWith(authPath));

  // If the user is authenticated and tries to access auth pages
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/post/:path*", "/profile/:path*", "/login", "/signup"],
};