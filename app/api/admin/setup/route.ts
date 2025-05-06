import { type NextRequest, NextResponse } from "next/server"
import { createAdminUser } from "@/scripts/create-admin-user"
import { z } from "zod"

// Schema for validating the request body
const adminUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  setupKey: z.string().min(1, "Setup key is required"),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const result = adminUserSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request data", errors: result.error.errors },
        { status: 400 },
      )
    }

    const { email, password, firstName, lastName, setupKey, country, phoneNumber } = result.data

    // Verify the setup key
    const expectedSetupKey = process.env.ADMIN_SETUP_KEY

    if (!expectedSetupKey) {
      return NextResponse.json(
        { success: false, message: "ADMIN_SETUP_KEY environment variable is not set" },
        { status: 500 },
      )
    }

    if (setupKey !== expectedSetupKey) {
      return NextResponse.json({ success: false, message: "Invalid setup key" }, { status: 403 })
    }

    // Create the admin user
    const createResult = await createAdminUser(email, password, firstName, lastName, country, phoneNumber)

    if (!createResult.success) {
      return NextResponse.json({ success: false, message: createResult.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: createResult.message,
      user: createResult.user,
    })
  } catch (error) {
    console.error("Error in admin setup:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
