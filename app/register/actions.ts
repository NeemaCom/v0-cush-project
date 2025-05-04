"use server"
import { registerUser } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  country: z.string().min(1, { message: "Please select your country." }),
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
})

export async function registerUserAction(formData: FormData) {
  try {
    // Extract and validate form data
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      country: formData.get("country") as string,
      phoneNumber: formData.get("phoneNumber") as string,
    }

    // Validate the data
    const validatedData = registerSchema.parse(rawData)

    // Register the user
    const result = await registerUser(validatedData)
    return {
      success: true,
      message: "Registration successful. Please log in.",
      emailSkipped: result.emailSkipped,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        path: err.path[0],
        message: err.message,
      }))
      return { success: false, errors: errorMessages }
    }

    if (error instanceof Error) {
      return { success: false, message: error.message }
    }

    return { success: false, message: "An unknown error occurred" }
  }
}
