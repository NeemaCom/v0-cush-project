import { redis } from "./redis"
import { sendEmail } from "./email"

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 24 * 60 * 60

/**
 * Generate a verification token
 * @param {string} userId - The user ID
 * @returns {Promise<string>} - The verification token
 */
export async function createVerificationToken(userId: string): Promise<string> {
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

/**
 * Verify a token
 * @param {string} token - The verification token
 * @returns {Promise<{success: boolean, userId?: string, error?: string}>} - Verification result
 */
export async function verifyToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Get the user ID from the token
    const tokenKey = `verification:${token}`
    const userId = await redis.get(tokenKey)

    if (!userId) {
      return { success: false, error: "Invalid or expired verification token" }
    }

    // Get the user
    const userData = await redis.get(`user:${userId}`)

    if (!userData) {
      return { success: false, error: "User not found" }
    }

    const user = JSON.parse(userData as string)

    // Update the user's verification status
    user.emailVerified = true
    await redis.set(`user:${userId}`, JSON.stringify(user))

    // Delete the token
    await redis.del(tokenKey)
    await redis.del(`user:${userId}:verification`)

    return { success: true, userId }
  } catch (error) {
    console.error("Error verifying token:", error)
    return { success: false, error: "An error occurred during verification" }
  }
}

/**
 * Resend verification email
 * @param {string} email - The user's email
 * @returns {Promise<{success: boolean, message: string}>} - Result of the operation
 */
export async function resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Get the user ID from the email
    const userId = await redis.get(`user:email:${email.toLowerCase()}`)

    if (!userId) {
      return { success: false, message: "User not found" }
    }

    // Get the user
    const userData = await redis.get(`user:${userId}`)

    if (!userData) {
      return { success: false, message: "User not found" }
    }

    const user = JSON.parse(userData as string)

    // Check if the email is already verified
    if (user.emailVerified) {
      return { success: false, message: "Email is already verified" }
    }

    // Create a new verification token
    const token = await createVerificationToken(userId)

    // Send the verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`

    await sendEmail({
      to: email,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3366FF;">Verify Your Email Address</h1>
          <p>Hi ${user.firstName},</p>
          <p>You requested a new verification link. Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3366FF; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not request this email, please ignore it.</p>
          <p>Best regards,<br/>The Cush Team</p>
        </div>
      `,
    })

    return { success: true, message: "Verification email sent" }
  } catch (error) {
    console.error("Error resending verification email:", error)
    return { success: false, message: "An error occurred" }
  }
}
