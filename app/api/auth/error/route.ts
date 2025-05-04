import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Get error from query parameters
  const url = new URL(request.url)
  const error = url.searchParams.get("error") || "unknown"

  // Return a simple JSON response
  return NextResponse.json({
    status: "error",
    error: error,
    message: "Authentication error occurred",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: Request) {
  return GET(request)
}
