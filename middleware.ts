import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/",
  "/auth/error",
  "/verify-email",
  "/resend-verification",
  "/unverified-email",
  "/api/auth",
]

// Paths that require admin role
const adminPaths = ["/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // If no token, redirect to login
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Check if email is verified
  if (token.emailVerified === false) {
    const url = new URL(`/unverified-email`, request.url)
    url.searchParams.set("email", token.email as string)
    return NextResponse.redirect(url)
  }

  // Check if admin paths require admin role
  if (adminPaths.some((path) => pathname.startsWith(path)) && token.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
