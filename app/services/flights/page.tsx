import type { Metadata } from "next"
import { FlightSearchForm } from "@/components/flight-search-form"

export const metadata: Metadata = {
  title: "Book Flights - Cush",
  description: "Book flights to your destination with Cush",
}

export default function FlightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Book Flights</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Search and book flights to your destination with Cush. We offer competitive prices and excellent service.
      </p>

      <FlightSearchForm />
    </div>
  )
}
