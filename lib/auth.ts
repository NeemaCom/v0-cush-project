import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare, hash } from "bcryptjs"
import { redis } from "./redis"
import { sendWelcomeEmail } from "./email"

export type UserRole = "user" | "admin" | "support"

// Helper function to generate a UUID without using crypto directly
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error", // Updated to use our custom error page
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // Get user from Redis
          const userKey = `user:email:${credentials.email.toLowerCase()}`
          const userId = await redis.get(userKey)

          if (!userId) {
            return null
          }

          const user = await redis.get(`user:${userId}`)

          if (!user) {
            return null
          }

          const parsedUser = JSON.parse(user as string)

          // Check if password matches
          const passwordMatch = await compare(credentials.password, parsedUser.password)

          if (!passwordMatch) {
            return null
          }

          // Update last login time and IP address if available
          try {
            parsedUser.lastLoginAt = new Date().toISOString()
            await redis.set(`user:${userId}`, JSON.stringify(parsedUser))
          } catch (error) {
            console.error("Error updating user login data:", error)
          }

          return {
            id: parsedUser.id,
            name: `${parsedUser.firstName} ${parsedUser.lastName}`,
            email: parsedUser.email,
            role: parsedUser.role || "user",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

// User registration function
export async function registerUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  country: string
  phoneNumber: string
  role?: UserRole
  ipAddress?: string
  userAgent?: string
}) {
  try {
    // Check if user already exists
    const userKey = `user:email:${userData.email.toLowerCase()}`
    const existingUser = await redis.get(userKey)

    if (existingUser) {
      throw new Error("User already exists")
    }

    // Generate a unique ID for the user using our custom function
    const userId = generateUUID()

    // Hash the password
    const hashedPassword = await hash(userData.password, 12)

    // Create user object with additional tracking fields
    const user = {
      id: userId,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      country: userData.country,
      phoneNumber: userData.phoneNumber,
      role: userData.role || "user",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      ipAddress: userData.ipAddress || null,
      userAgent: userData.userAgent || null,
      loginCount: 1,
    }

    // Save user to Redis
    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(userKey, userId)

    let emailSkipped = false
    // Send welcome email (non-blocking)
    try {
      const emailResult = await sendWelcomeEmail(user.email, `${user.firstName} ${user.lastName}`)
      emailSkipped = !emailResult.success || !!emailResult.skipped
    } catch (error) {
      console.error("Failed to send welcome email:", error)
      emailSkipped = true
      // Continue with registration even if email fails
    }

    return {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: user.role,
      emailSkipped,
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const user = await redis.get(`user:${id}`)
    if (!user) return null

    const parsedUser = JSON.parse(user as string)
    // Don't return the password
    delete parsedUser.password

    return parsedUser
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const userKey = `user:email:${email.toLowerCase()}`
    const userId = await redis.get(userKey)

    if (!userId) return null

    return getUserById(userId as string)
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Get all users (admin only)
export async function getAllUsers(page = 1, limit = 10) {
  try {
    const keys = await redis.keys("user:*")
    const userKeys = keys.filter(
      (key) => !key.includes("email:") && !key.includes(":documents") && !key.includes(":notifications"),
    )

    const total = userKeys.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedKeys = userKeys.slice(start, end)

    const users = []

    for (const key of paginatedKeys) {
      const user = await redis.get(key)
      if (user) {
        const parsedUser = JSON.parse(user as string)
        // Don't return the password
        delete parsedUser.password
        users.push(parsedUser)
      }
    }

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error getting all users:", error)
    return {
      users: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      },
    }
  }
}

// Update user role (admin only)
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const userKey = `user:${userId}`
    const user = await redis.get(userKey)

    if (!user) {
      throw new Error("User not found")
    }

    const parsedUser = JSON.parse(user as string)
    parsedUser.role = role

    await redis.set(userKey, JSON.stringify(parsedUser))

    return {
      id: parsedUser.id,
      email: parsedUser.email,
      firstName: parsedUser.firstName,
      lastName: parsedUser.lastName,
      role: parsedUser.role,
    }
  } catch (error) {
    console.error("Error updating user role:", error)
    throw error
  }
}

// Update user activity
export async function updateUserActivity(userId: string, ipAddress?: string) {
  try {
    const userKey = `user:${userId}`
    const user = await redis.get(userKey)

    if (!user) {
      throw new Error("User not found")
    }

    const parsedUser = JSON.parse(user as string)
    parsedUser.lastActiveAt = new Date().toISOString()

    if (ipAddress) {
      parsedUser.ipAddress = ipAddress
    }

    await redis.set(userKey, JSON.stringify(parsedUser))

    // Also update an activity log - useful for tracking user sessions
    const activityId = generateUUID()
    const activity = {
      id: activityId,
      userId,
      timestamp: new Date().toISOString(),
      type: "activity",
      ipAddress: ipAddress || parsedUser.ipAddress,
    }

    await redis.set(`activity:${activityId}`, JSON.stringify(activity))
    await redis.lpush(`user:${userId}:activities`, activityId)

    // Only keep last 100 activities per user
    await redis.ltrim(`user:${userId}:activities`, 0, 99)

    return parsedUser
  } catch (error) {
    console.error("Error updating user activity:", error)
    return null
  }
}

// Get user activities
export async function getUserActivities(userId: string, limit = 10) {
  try {
    const activityIds = await redis.lrange(`user:${userId}:activities`, 0, limit - 1)

    if (!activityIds.length) return []

    const activities = []

    for (const id of activityIds) {
      const activity = await redis.get(`activity:${id}`)
      if (activity) {
        activities.push(JSON.parse(activity as string))
      }
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  } catch (error) {
    console.error("Error getting user activities:", error)
    return []
  }
}
