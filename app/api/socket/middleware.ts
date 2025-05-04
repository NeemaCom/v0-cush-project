import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only apply to WebSocket upgrade requests
  if (request.headers.get("upgrade") !== "websocket") {
    return NextResponse.next()
  }

  try {
    // Get the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token, reject the WebSocket connection
    if (!token) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Add the user ID to the request for the WebSocket handler
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", token.id as string)

    // Continue with the modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error("WebSocket middleware error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export const config = {
  matcher: ["/api/socket"],
}
