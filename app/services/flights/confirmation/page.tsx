import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { CheckCircle2, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { getFlightBookingById } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "Booking Confirmation - Cush",
  description: "Your flight booking has been confirmed",
}

interface ConfirmationPageProps {
  searchParams: {
    bookingId: string
  }
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/services/flights/confirmation?bookingId=${searchParams.bookingId}`)}`,
    )
  }

  // Get the booking details
  const bookingId = searchParams.bookingId
  if (!bookingId) {
    redirect("/services/flights")
  }

  try {
    const booking = await getFlightBookingById(bookingId)
    if (!booking) {
      return notFound()
    }

    // Check if the booking belongs to the user
    if (booking.userId !== session.user.id) {
      return notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your flight has been booked successfully. A confirmation email has been sent to {booking.passengerEmail}.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Booking Details</span>
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

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Need help with your booking? Contact our support team at support@cushfinance.com
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild variant="outline">
                <Link href="/dashboard/flights">View My Bookings</Link>
              </Button>
              <Button asChild>
                <Link href="/services/flights">Book Another Flight</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in confirmation page:", error)
    return notFound()
  }
}
