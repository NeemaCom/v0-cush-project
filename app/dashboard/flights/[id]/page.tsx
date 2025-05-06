import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authOptions } from "@/lib/auth"
import { getFlightBookingById } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "Flight Booking Details - Cush",
  description: "View your flight booking details",
}

interface BookingDetailsPageProps {
  params: {
    id: string
  }
}

export default async function BookingDetailsPage({ params }: BookingDetailsPageProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/dashboard/flights/${params.id}`)}`)
  }

  try {
    const booking = await getFlightBookingById(params.id)
    if (!booking) {
      return notFound()
    }

    // Check if the booking belongs to the user
    if (booking.userId !== session.user.id && session.user.role !== "admin") {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <Badge className="capitalize">{booking.status}</Badge>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Flight Information</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Reference: <span className="font-bold">{booking.bookingReference}</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Passenger Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{booking.passengerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.passengerEmail}</p>
                  </div>
                  {booking.passengerPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{booking.passengerPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Flight Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Flight</p>
                    <p className="font-medium">{booking.outboundFlight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{booking.departureDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-medium">{booking.departureTime}</p>
                    <p className="text-sm">
                      {booking.departureAirport} ({booking.departureCode})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-medium">{booking.arrivalTime}</p>
                    <p className="text-sm">
                      {booking.arrivalAirport} ({booking.arrivalCode})
                    </p>
                  </div>
                </div>
              </div>

              {booking.returnFlight && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Return Flight</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Flight</p>
                      <p className="font-medium">{booking.returnFlight}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{booking.returnDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Departure</p>
                      <p className="font-medium">{booking.returnDepartureTime}</p>
                      <p className="text-sm">
                        {booking.returnDepartureAirport} ({booking.returnDepartureCode})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Arrival</p>
                      <p className="font-medium">{booking.returnArrivalTime}</p>
                      <p className="text-sm">
                        {booking.returnArrivalAirport} ({booking.returnArrivalCode})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      ${booking.price.toFixed(2)} {booking.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">{booking.paymentMethod || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{booking.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{booking.updatedAt?.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-between">
            <Button asChild variant="outline">
              <Link href="/dashboard/flights">Back to Bookings</Link>
            </Button>

            {booking.status === "pending" && (
              <Button asChild variant="destructive">
                <Link href={`/dashboard/flights/${booking.id}/cancel`}>Cancel Booking</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in booking details page:", error)
    return notFound()
  }
}
