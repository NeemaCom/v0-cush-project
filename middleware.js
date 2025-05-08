import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/auth/error",
  "/api/auth",
  "/verify-email",
  "/resend-verification",
  "/unverified-email",
]

// Paths that require admin role
const adminPaths = ["/admin"]

/**
 * Checks if a path matches any of the provided paths
 * @param {string} path - The path to check
 * @param {string[]} pathsToMatch - Array of paths to match against
 * @returns {boolean} - Whether the path matches any of the provided paths
 */
function matchesPath(path, pathsToMatch) {
  return pathsToMatch.some((p) => {
    // Exact match
    if (p === path) return true
    // Path starts with p and p ends with /
    if (p.endsWith("/") && path.startsWith(p)) return true
    // Path starts with p/
    if (path.startsWith(`${p}/`)) return true
    return false
  })
}

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes (except auth API)
  if (pathname.startsWith("/_next") || (pathname.includes("/api/") && !pathname.includes("/api/auth"))) {
    return NextResponse.next()
  }

  // Get the user's token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const isAdmin = token?.role === "admin"
  const isEmailVerified = token?.emailVerified === true

  // Check if the path is public
  const isPublicPath = matchesPath(pathname, publicPaths)

  // Redirect authenticated users away from public pages like login
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Check if the path requires admin role
  const isAdminPath = matchesPath(pathname, adminPaths)

  // Redirect non-admin users away from admin pages
  if (isAuthenticated && isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isPublicPath) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Redirect users with unverified emails to verification page
  if (
    isAuthenticated &&
    !isEmailVerified &&
    !isPublicPath &&
    pathname !== "/unverified-email" &&
    !pathname.startsWith("/api/")
  ) {
    return NextResponse.redirect(new URL("/unverified-email", request.url))
  }

  return NextResponse.next()
}
