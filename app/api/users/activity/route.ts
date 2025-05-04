import { NextResponse } from "next/server"
import { updateUserActivity } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    // Get the token from the headers
    const authToken = request.headers.get("x-auth-token")

    if (!authToken) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Parse the token
    const token = JSON.parse(authToken)

    if (!token.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Get the request body
    const body = await request.json()
    const { userId, ipAddress } = body

    // Verify that the user ID in the token matches the one in the request
    if (token.id !== userId) {
      return NextResponse.json({ success: false, message: "User ID mismatch" }, { status: 403 })
    }

    // Update the user's activity
    await updateUserActivity(userId, ipAddress)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user activity:", error)
    return NextResponse.json({ success: false, message: "Failed to update user activity" }, { status: 500 })
  }
}
