import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { searchFlights, getUserFlightBookings } from "@/lib/flight-booking"
import { FlightSearchSchema } from "@/lib/db/schema"

// Get flights based on search criteria or user's bookings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")

    // If type is "bookings", return user's bookings
    if (type === "bookings") {
      const bookings = await getUserFlightBookings(session.user.id)
      return NextResponse.json({ bookings })
    }

    // Otherwise, search for flights
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const departureDate = searchParams.get("departureDate")
    const returnDate = searchParams.get("returnDate")
    const passengers = searchParams.get("passengers")
    const cabinClass = searchParams.get("cabinClass")

    // Validate search params
    const validatedParams = FlightSearchSchema.parse({
      from: from || "",
      to: to || "",
      departureDate: departureDate || "",
      returnDate: returnDate || undefined,
      passengers: passengers ? Number.parseInt(passengers) : 1,
      cabinClass: (cabinClass as any) || "economy",
    })

    // Search for flights
    const flights = await searchFlights(validatedParams)

    return NextResponse.json({ flights })
  } catch (error) {
    console.error("Error in flights API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
