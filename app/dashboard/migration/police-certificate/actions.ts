"use server"

import { v4 as uuidv4 } from "uuid"
import { saveApplication } from "@/lib/redis"
import { createPaymentIntent } from "@/lib/stripe"

export async function submitCertificateApplication(formData: FormData) {
  try {
    // Extract form data
    const fullName = formData.get("fullName") as string
    const dateOfBirth = formData.get("dateOfBirth") as string
    const placeOfBirth = formData.get("placeOfBirth") as string
    const nationality = formData.get("nationality") as string
    const passportNumber = formData.get("passportNumber") as string
    const gender = formData.get("gender") as string
    const address = formData.get("address") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const purpose = formData.get("purpose") as string
    const deliveryMethod = formData.get("deliveryMethod") as string
    const processingTime = formData.get("processingTime") as string

    // Calculate price based on processing time
    let price = 0
    switch (processingTime) {
      case "standard":
        price = 100
        break
      case "express":
        price = 150
        break
      case "urgent":
        price = 200
        break
      default:
        price = 100
    }

    // Add delivery fee if applicable
    if (deliveryMethod === "courier") {
      price += 30
    }

    // Generate a unique ID for the application
    const applicationId = uuidv4()

    // In a real app, you would get the user ID from authentication
    const userId = "user123"

    // Save the application to Redis
    await saveApplication("police-certificate", applicationId, {
      id: applicationId,
      userId,
      status: "pending_payment",
      createdAt: new Date().toISOString(),
      price,
      fullName,
      dateOfBirth,
      placeOfBirth,
      nationality,
      passportNumber,
      gender,
      address,
      email,
      phone,
      purpose,
      deliveryMethod,
      processingTime,
    })

    // Create a payment intent with Stripe
    const { clientSecret, id } = await createPaymentIntent(price * 100)

    return {
      success: true,
      applicationId,
      price,
      paymentIntentId: id,
      clientSecret,
    }
  } catch (error) {
    console.error("Error submitting certificate application:", error)
    return { success: false, error: "Failed to submit application" }
  }
}
