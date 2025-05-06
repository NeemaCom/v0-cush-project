import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  getFlightBookingById,
  updateFlightBooking,
  confirmFlightBooking,
  cancelFlightBooking,
} from "@/lib/flight-booking"

// Get a flight booking by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingId = params.id
    const booking = await getFlightBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user or user is admin
    if (booking.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error("Error in flight booking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Update a flight booking
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingId = params.id
    const booking = await getFlightBookingById(bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if the booking belongs to the user or user is admin
    if (booking.userId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get update data from request body
    const body = await request.json()
    const { action, ...updates } = body

    let updatedBooking

    // Handle different actions
    if (action === "confirm" && updates.paymentId && updates.paymentMethod) {
      updatedBooking = await confirmFlightBooking(bookingId, updates.paymentId, updates.paymentMethod)
    } else if (action === "cancel") {
      updatedBooking = await cancelFlightBooking(bookingId)
    } else {
      updatedBooking = await updateFlightBooking(bookingId, updates)
    }

    if (!updatedBooking) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    console.error("Error in flight booking API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
