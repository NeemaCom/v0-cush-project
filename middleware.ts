import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Create a Supabase client for the middleware with explicit environment variables
  const supabase = createMiddlewareClient(
    {
      req: request,
      res: response,
    },
    {
      supabaseUrl: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY,
    },
  )

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the path is protected
  const protectedPaths = ["/dashboard", "/admin"]
  const isPathProtected = protectedPaths.some((path) => pathname.startsWith(path))
  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/register")

  // If the path is protected and the user is not authenticated, redirect to login
  if (isPathProtected && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
