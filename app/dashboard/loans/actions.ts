"use server"

import { v4 as uuidv4 } from "uuid"
import { saveApplication } from "@/lib/redis"

export async function submitLoanApplication(formData: FormData) {
  try {
    // Extract form data
    const loanType = formData.get("loanType") as string
    const amount = formData.get("amount") as string
    const purpose = formData.get("purpose") as string
    const duration = formData.get("duration") as string
    const employmentStatus = formData.get("employmentStatus") as string
    const monthlyIncome = formData.get("monthlyIncome") as string

    // Generate a unique ID for the application
    const applicationId = uuidv4()

    // In a real app, you would get the user ID from authentication
    const userId = "user123"

    // Save the application to Redis
    await saveApplication("loan", applicationId, {
      id: applicationId,
      userId,
      status: "pending",
      createdAt: new Date().toISOString(),
      loanType,
      amount,
      purpose,
      duration,
      employmentStatus,
      monthlyIncome,
    })

    return { success: true, applicationId }
  } catch (error) {
    console.error("Error submitting loan application:", error)
    return { success: false, error: "Failed to submit loan application" }
  }
}
