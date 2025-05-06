import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { FlightBookingsList } from "@/components/flight-bookings-list"
import { authOptions } from "@/lib/auth"
import { getUserFlightBookings } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "My Flight Bookings - Cush",
  description: "View and manage your flight bookings",
}

export default async function FlightBookingsPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/flights")
  }

  // Get user's flight bookings
  const bookings = await getUserFlightBookings(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Flight Bookings</h1>

      <FlightBookingsList bookings={bookings} />
    </div>
  )
}
