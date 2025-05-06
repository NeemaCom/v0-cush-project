"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Calendar, Clock, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Flight } from "@/lib/db/schema"
import { useAuth } from "@/hooks/use-auth"

interface FlightSearchResultsProps {
  flights: Flight[]
  searchParams: {
    from: string
    to: string
    departureDate: string
    returnDate?: string
    passengers?: string
    cabinClass?: string
  }
}

export function FlightSearchResults({ flights, searchParams }: FlightSearchResultsProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null)

  const handleSelectFlight = (flightId: string) => {
    if (!user && !isLoading) {
      // Redirect to login if not logged in
      router.push(`/login?callbackUrl=${encodeURIComponent(`/services/flights/booking?flightId=${flightId}`)}`)
      return
    }

    // Navigate to booking page
    router.push(`/services/flights/booking?flightId=${flightId}`)
  }

  if (flights.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No flights found</h3>
            <p className="text-muted-foreground">
              We couldn't find any flights matching your search criteria. Please try different dates or destinations.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Available Flights</h2>

      {flights.map((flight) => (
        <Card key={flight.id} className={selectedFlightId === flight.id ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span>{flight.airline}</span>
              <span className="font-bold">${flight.price.toFixed(2)}</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Flight {flight.flightNumber}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold">{flight.departureTime}</p>
                  <p className="text-sm text-muted-foreground">{flight.departureCode}</p>
                </div>

                <div className="flex flex-col items-center">
                  <p className="text-xs text-muted-foreground">{flight.duration}</p>
                  <div className="relative w-24 md:w-32">
                    <div className="absolute top-1/2 w-full h-px bg-muted-foreground"></div>
                    <Plane className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Direct</p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold">{flight.arrivalTime}</p>
                  <p className="text-sm text-muted-foreground">{flight.arrivalCode}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{flight.departureDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{flight.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{flight.cabinClass}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-muted-foreground">Seats available: </span>
              <span className="font-medium">{flight.seatsAvailable}</span>
            </div>
            <Button onClick={() => handleSelectFlight(flight.id)}>
              Select <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
