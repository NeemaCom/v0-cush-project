import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, getAllUsers } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if the user is authenticated and has admin role
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    // Get all users with pagination
    const result = await getAllUsers(page, limit)

    return NextResponse.json({
      success: true,
      users: result.users,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch users" }, { status: 500 })
  }
}
