import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions, updateUserRole, getUserById, getUserActivities } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if the user is authenticated and has admin role
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const user = await getUserById(userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const includeActivities = searchParams.get("activities") === "true"

    let activities = []
    if (includeActivities) {
      activities = await getUserActivities(userId)
    }

    return NextResponse.json({
      success: true,
      user,
      activities: includeActivities ? activities : undefined,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if the user is authenticated and has admin role
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const userId = params.id
    const { role } = await request.json()

    // Validate role
    if (!["user", "support", "admin"].includes(role)) {
      return NextResponse.json({ success: false, message: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const updatedUser = await updateUserRole(userId, role)

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ success: false, message: "Failed to update user role" }, { status: 500 })
  }
}
