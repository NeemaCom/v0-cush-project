import Stripe from "stripe"

// Initialize Stripe with the API key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function createPaymentIntent(amount: number, currency = "usd") {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    })

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw error
  }
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}
