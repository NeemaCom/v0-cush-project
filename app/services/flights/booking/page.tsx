import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { FlightBookingForm } from "@/components/flight-booking-form"
import { authOptions } from "@/lib/auth"
import { searchFlights } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "Book Flight - Cush",
  description: "Complete your flight booking with Cush",
}

interface BookingPageProps {
  searchParams: {
    flightId: string
  }
}

export default async function FlightBookingPage({ searchParams }: BookingPageProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/services/flights/booking?flightId=${searchParams.flightId}`)}`)
  }

  // Get the flight details
  const flightId = searchParams.flightId
  if (!flightId) {
    redirect("/services/flights")
  }

  try {
    // In a real app, you would fetch the specific flight by ID
    // For this demo, we'll search for flights and find the one with the matching ID
    const flights = await searchFlights({
      from: "LOS",
      to: "LHR",
      departureDate: new Date().toISOString().split("T")[0],
    })

    const flight = flights.find((f) => f.id === flightId)
    if (!flight) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FlightBookingForm flight={flight} userId={session.user.id} />
          </div>

          <div>
            <div className="bg-muted p-6 rounded-lg sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Flight Summary</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Airline</p>
                  <p className="font-medium">{flight.airline}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Flight</p>
                  <p className="font-medium">{flight.flightNumber}</p>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{flight.departureCode}</p>
                    <p className="text-sm">{flight.departureAirport}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{flight.arrivalCode}</p>
                    <p className="text-sm">{flight.arrivalAirport}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{flight.departureDate}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {flight.departureTime} - {flight.arrivalTime}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{flight.duration}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Cabin Class</p>
                  <p className="font-medium capitalize">{flight.cabinClass}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <p className="font-semibold">Total Price</p>
                    <p className="font-bold">${flight.price.toFixed(2)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Includes all taxes and fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in flight booking page:", error)
    return notFound()
  }
}
