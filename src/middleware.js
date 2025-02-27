import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If already logged in, prevent access to auth pages (login, register)
  if (session && ["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If not logged in, restrict access to protected pages (not /auth/* or /reset-password)
  if (
    !session &&
    !pathname.startsWith("/auth") &&
    pathname !== "/reset-password"
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If not logged in and trying to access /auth/logout, redirect to login page
  if (!session && pathname === "/auth/logout") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all pages except API routes and static assets
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
