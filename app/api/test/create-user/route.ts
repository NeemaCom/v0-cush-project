import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // Generate a test user ID
    const userId = "test-user-" + Date.now()
    const email = `test-${Date.now()}@example.com`
    const password = "password123"

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create user object
    const user = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: "Test",
      lastName: "User",
      country: "United States",
      phoneNumber: "123-456-7890",
      role: "user",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    }

    // Save user to Redis
    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(`user:email:${email.toLowerCase()}`, userId)

    return NextResponse.json({
      success: true,
      message: "Test user created successfully",
      user: {
        id: userId,
        email,
        password: "password123", // Only showing this because it's a test user
        name: "Test User",
      },
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json({ error: "Failed to create test user", details: String(error) }, { status: 500 })
  }
}
