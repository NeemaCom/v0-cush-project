import { redis } from "./redis"
import { sendTemplateEmail } from "./email"
import { getUserByEmail, getUserById, updateUserById } from "./auth"

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 24 * 60 * 60

// Generate a verification token
export async function generateVerificationToken(userId: string, email: string): Promise<string> {
  // Generate a random token
  const token = crypto.randomUUID()

  // Store the token in Redis with expiration
  const tokenKey = `verification:${token}`
  await redis.set(tokenKey, userId)
  await redis.expire(tokenKey, TOKEN_EXPIRATION)

  // Also store a reverse lookup to prevent multiple tokens per user
  const userTokenKey = `user:${userId}:verification`
  await redis.set(userTokenKey, token)
  await redis.expire(userTokenKey, TOKEN_EXPIRATION)

  return token
}

// Verify a token
export async function verifyToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Get the user ID from the token
    const tokenKey = `verification:${token}`
    const userId = await redis.get(tokenKey)

    if (!userId) {
      return { success: false, error: "Invalid or expired verification token" }
    }

    // Get the user
    const user = await getUserById(userId as string)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Update the user's verification status
    await updateUserById(userId as string, { emailVerified: true })

    // Delete the token
    await redis.del(tokenKey)
    await redis.del(`user:${userId}:verification`)

    return { success: true, userId: userId as string }
  } catch (error) {
    console.error("Error verifying token:", error)
    return { success: false, error: "An error occurred during verification" }
  }
}

// Send verification email
export async function sendVerificationEmail(userId: string, email: string, name: string): Promise<boolean> {
  try {
    // Check if a token already exists for this user
    const userTokenKey = `user:${userId}:verification`
    let token = await redis.get(userTokenKey)

    // If no token exists, generate a new one
    if (!token) {
      token = await generateVerificationToken(userId, email)
    }

    // Generate the verification URL
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    // Send the email
    const result = await sendTemplateEmail({
      to: email,
      templateName: "accountVerification",
      variables: { name, verificationUrl },
    })

    return result.success
  } catch (error) {
    console.error("Error sending verification email:", error)
    return false
  }
}

// Resend verification email
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the user
    const user = await getUserByEmail(email)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Check if the email is already verified
    if (user.emailVerified) {
      return { success: false, message: "Email is already verified" }
    }

    // Send the verification email
    const emailSent = await sendVerificationEmail(user.id, user.email, `${user.firstName} ${user.lastName}`)

    if (!emailSent) {
      return { success: false, message: "Failed to send verification email" }
    }

    return { success: true, message: "Verification email sent" }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, message: "An error occurred" }
  }
}
