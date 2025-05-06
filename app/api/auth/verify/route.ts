import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/verification"

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, error: "No verification token provided" }, { status: 400 })
    }

    const result = await verifyToken(token)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 })
  }
}
