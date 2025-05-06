import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { PaymentForm } from "@/components/payment-form"
import { authOptions } from "@/lib/auth"
import { getFlightBookingById } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "Payment - Cush",
  description: "Complete your payment for your flight booking",
}

interface PaymentPageProps {
  searchParams: {
    bookingId: string
  }
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/services/flights/payment?bookingId=${searchParams.bookingId}`)}`,
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
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentForm booking={booking} />
          </div>

          <div>
            <div className="bg-muted p-6 rounded-lg sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Reference</p>
                  <p className="font-medium">{booking.bookingReference}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Passenger</p>
                  <p className="font-medium">{booking.passengerName}</p>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{booking.departureCode}</p>
                    <p className="text-sm">{booking.departureAirport}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{booking.arrivalCode}</p>
                    <p className="text-sm">{booking.arrivalAirport}</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{booking.departureDate}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {booking.departureTime} - {booking.arrivalTime}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <p className="font-semibold">Total Price</p>
                    <p className="font-bold">
                      ${booking.price.toFixed(2)} {booking.currency}
                    </p>
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
    console.error("Error in payment page:", error)
    return notFound()
  }
}
