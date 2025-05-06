"use server"
import { registerUser } from "@/lib/auth"
import { sendVerificationEmail } from "@/lib/verification"

export async function registerUserAction(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const country = formData.get("country") as string
    const phoneNumber = formData.get("phoneNumber") as string

    // Validate form data
    if (!firstName || !lastName || !email || !password || !country || !phoneNumber) {
      return { success: false, message: "All fields are required" }
    }

    // Register the user
    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
      country,
      phoneNumber,
    })

    // Send verification email
    try {
      await sendVerificationEmail(result.id, result.email, `${result.firstName} ${result.lastName}`)
    } catch (error) {
      console.error("Error sending verification email:", error)
      // Continue with registration even if verification email fails
    }

    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      emailSkipped: result.emailSkipped,
    }
  } catch (error: any) {
    console.error("Registration error:", error)
    return { success: false, message: error.message || "Registration failed" }
  }
}
