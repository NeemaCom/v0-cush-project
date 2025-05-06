"use client"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FlightBooking } from "@/lib/db/schema"

interface FlightBookingsListProps {
  bookings: FlightBooking[]
}

export function FlightBookingsList({ bookings }: FlightBookingsListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground mb-4">You haven't made any flight bookings yet.</p>
            <Button asChild>
              <Link href="/services/flights">Book a Flight</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>{booking.departureCode}</span>
                <ArrowRight className="h-4 w-4" />
                <span>{booking.arrivalCode}</span>
                <Badge className="ml-2 capitalize">{booking.status}</Badge>
              </div>
              <span className="text-sm font-normal text-muted-foreground">
                Ref: <span className="font-bold">{booking.bookingReference}</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{booking.departureTime}</p>
                  <p className="text-sm text-muted-foreground">{booking.departureCode}</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-24 md:w-32">
                    <div className="absolute top-1/2 w-full h-px bg-muted-foreground"></div>
                    <Plane className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold">{booking.arrivalTime}</p>
                  <p className="text-sm text-muted-foreground">{booking.arrivalCode}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.departureDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {booking.departureTime} - {booking.arrivalTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.outboundFlight}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Passenger: </span>
              <span className="font-medium">{booking.passengerName}</span>
            </div>
            <Button asChild variant="outline">
              <Link href={`/dashboard/flights/${booking.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
