import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { savePayment } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    const { amount, applicationId, applicationType } = await request.json()

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      metadata: {
        applicationId,
        applicationType,
      },
    })

    // Save payment information to Redis
    await savePayment(paymentIntent.id, {
      id: paymentIntent.id,
      applicationId,
      applicationType,
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
