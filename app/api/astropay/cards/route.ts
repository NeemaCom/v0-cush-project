import { type NextRequest, NextResponse } from "next/server"
import { astroPayService } from "@/lib/astropay"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, currency, cardType } = body

    if (!amount || !currency || !cardType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userId = session.user.id

    const result = await astroPayService.createVirtualCard({
      userId,
      amount,
      currency,
      cardType,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating virtual card:", error)
    return NextResponse.json({ error: "Failed to create virtual card" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const result = await astroPayService.getUserCards(userId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching user cards:", error)
    return NextResponse.json({ error: "Failed to fetch user cards" }, { status: 500 })
  }
}
