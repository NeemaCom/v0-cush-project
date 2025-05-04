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
    const { amount, currency, recipientId } = body

    if (!amount || !currency || !recipientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userId = session.user.id

    const result = await astroPayService.transferMoney({
      userId,
      amount,
      currency,
      recipientId,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error transferring money:", error)
    return NextResponse.json({ error: "Failed to transfer money" }, { status: 500 })
  }
}
