import { type NextRequest, NextResponse } from "next/server"
import { resendVerificationEmail } from "@/lib/verification"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const result = await resendVerificationEmail(email)

    return NextResponse.json(result, { status: result.success ? 200 : 400 })
  } catch (error) {
    console.error("Error resending verification email:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
