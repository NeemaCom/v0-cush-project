import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getPayment, getApplication, saveApplication, savePayment } from "@/lib/redis"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object

    // Get payment information from Redis
    const payment = await getPayment(paymentIntent.id)

    if (payment) {
      // Update payment status
      payment.status = "completed"
      await savePayment(paymentIntent.id, payment)

      // Update application status
      const application = await getApplication(payment.applicationType, payment.applicationId)

      if (application) {
        application.status = "processing"
        await saveApplication(payment.applicationType, payment.applicationId, application)
      }
    }
  }

  return NextResponse.json({ received: true })
}
