import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Allow non-authenticated users to book consultations
    // but track the session if available

    const body = await request.json()
    const { name, email, phone, message, date, timeSlot, consultationType } = body

    if (!name || !email || !phone || !date || !timeSlot || !consultationType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Here you would typically save the consultation booking to your database
    // and potentially send confirmation emails

    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully",
      bookingId: Date.now().toString(),
      details: {
        name,
        email,
        phone,
        message,
        date,
        timeSlot,
        consultationType,
        userId: session?.user?.id || null,
      },
    })
  } catch (error) {
    console.error("Error booking consultation:", error)
    return NextResponse.json({ error: "Failed to book consultation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Here you would typically fetch the user's booked consultations from your database

    // For now, we'll just return a mock response
    return NextResponse.json({
      consultations: [
        {
          id: "1",
          type: "migration-uk",
          title: "UK Migration Consultation",
          date: "2025-04-15T10:00:00Z",
          status: "upcoming",
        },
        {
          id: "2",
          type: "financial-planning",
          title: "Financial Planning Consultation",
          date: "2025-03-20T14:00:00Z",
          status: "completed",
        },
      ],
    })
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}
