"use server"

import { hash } from "bcrypt"
import { v4 as uuidv4 } from "uuid"
import { redis } from "@/lib/redis"
import { sendEmail } from "@/lib/email"
import { createVerificationToken } from "@/lib/verification"

/**
 * Register a new user
 * @param {FormData} formData - The form data
 */
export async function registerUser(formData) {
  try {
    // Extract form data
    const email = formData.get("email")
    const password = formData.get("password")
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const country = formData.get("country")
    const phoneNumber = formData.get("phoneNumber")

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email.toLowerCase()}`)

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists",
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Generate user ID
    const userId = uuidv4()

    // Create user object
    const user = {
      id: userId,
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      country,
      phoneNumber,
      role: "user",
      emailVerified: false,
      emailVerificationRequired: true,
      createdAt: new Date().toISOString(),
    }

    // Save user to Redis
    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(`user:email:${email.toLowerCase()}`, userId)

    // Create verification token
    const verificationToken = await createVerificationToken(userId)

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`

      await sendEmail({
        to: email,
        subject: "Verify your email address",
        templateId: "email-verification",
        variables: {
          firstName,
          verificationUrl,
        },
        fallbackText: `
          Hi ${firstName},
          
          Thank you for registering with Cush Migration. Please verify your email address by clicking the link below:
          
          ${verificationUrl}
          
          This link will expire in 24 hours.
          
          If you did not create an account, please ignore this email.
          
          Best regards,
          The Cush Migration Team
        `,
      }).catch((error) => {
        console.error("Error sending verification email:", error)
        // Continue registration process even if email sending fails
      })
    } catch (error) {
      console.error("Error in email verification process:", error)
      // Continue registration process even if email verification fails
    }

    return {
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      userId,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    }
  }
}

/**
 * Register user action - Client action wrapper for registerUser
 * @param {FormData} formData - The form data
 */
export async function registerUserAction(formData) {
  return registerUser(formData)
}
