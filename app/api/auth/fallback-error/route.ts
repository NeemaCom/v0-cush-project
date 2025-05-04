import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    error: true,
    code: "fallback_error",
    message: "An authentication error occurred. Please try again or contact support.",
    timestamp: new Date().toISOString(),
  })
}

export async function POST() {
  return GET()
}
