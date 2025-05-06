import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "success",
    message: "This is a test error response",
    error: "test_error",
    description: "This is a test error description",
    timestamp: new Date().toISOString(),
  })
}
