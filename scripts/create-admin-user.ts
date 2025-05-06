import { hash } from "bcryptjs"
import { redis } from "../lib/redis"

// Helper function to generate a UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Function to create an admin user
export async function createAdminUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country = "Global",
  phoneNumber = "+1234567890",
) {
  try {
    // Check if user already exists
    const userKey = `user:email:${email.toLowerCase()}`
    const existingUser = await redis.get(userKey)

    if (existingUser) {
      // If user exists, check if they're already an admin
      const userId = existingUser
      const user = await redis.get(`user:${userId}`)

      if (user) {
        const parsedUser = JSON.parse(user as string)

        if (parsedUser.role === "admin") {
          return {
            success: true,
            message: "User is already an admin",
            user: {
              id: parsedUser.id,
              email: parsedUser.email,
              firstName: parsedUser.firstName,
              lastName: parsedUser.lastName,
              role: parsedUser.role,
            },
          }
        }

        // Update the user to be an admin
        parsedUser.role = "admin"
        await redis.set(`user:${userId}`, JSON.stringify(parsedUser))

        return {
          success: true,
          message: "User role updated to admin",
          user: {
            id: parsedUser.id,
            email: parsedUser.email,
            firstName: parsedUser.firstName,
            lastName: parsedUser.lastName,
            role: parsedUser.role,
          },
        }
      }
    }

    // Generate a unique ID for the user
    const userId = generateUUID()

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create user object with admin role
    const user = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      country,
      phoneNumber,
      role: "admin",
      emailVerified: true, // Admin users are automatically verified
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      ipAddress: null,
      userAgent: null,
      loginCount: 0,
    }

    // Save user to Redis
    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(userKey, userId)

    return {
      success: true,
      message: "Admin user created successfully",
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role: "admin",
      },
    }
  } catch (error) {
    console.error("Error creating admin user:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
