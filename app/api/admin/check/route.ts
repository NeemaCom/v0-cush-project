import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // Get all user keys
    const keys = await redis.keys("user:*")
    const userKeys = keys.filter(
      (key) => !key.includes("email:") && !key.includes(":documents") && !key.includes(":notifications"),
    )

    let adminExists = false

    // Check if any user has admin role
    for (const key of userKeys) {
      const user = await redis.get(key)
      if (user) {
        const parsedUser = JSON.parse(user as string)
        if (parsedUser.role === "admin") {
          adminExists = true
          break
        }
      }
    }

    return NextResponse.json({
      success: true,
      adminExists,
    })
  } catch (error) {
    console.error("Error checking admin existence:", error)
    return NextResponse.json({ success: false, message: "Failed to check admin existence" }, { status: 500 })
  }
}
