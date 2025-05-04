import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      message: "Auth API is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Auth API error",
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
