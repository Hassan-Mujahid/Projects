// export { auth as middleware } from "./auth";

import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(async function middleware(req) {
  const session = await auth();
  const path = req.nextUrl.pathname;

  // Define public paths
  const isPublicPath =
    path === "/sign-in" ||
    path === "/sign-up" ||
    path === "/forgot-password" ||
    path === "/reset-password";

  // If user is logged in and tries to access auth pages, redirect to home
  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not logged in and tries to access protected routes
  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!session && path === "/") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
});

// Configure which routes to protect
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/forgot-password",
    "/reset-password",
    // Add other protected routes here
  ],
};
