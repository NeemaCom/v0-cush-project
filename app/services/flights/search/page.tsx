import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FlightSearchResults } from "@/components/flight-search-results"
import { FlightSearchSchema } from "@/lib/db/schema"
import { searchFlights } from "@/lib/flight-booking"

export const metadata: Metadata = {
  title: "Flight Search Results - Cush",
  description: "View available flights for your search criteria",
}

interface SearchPageProps {
  searchParams: {
    from: string
    to: string
    departureDate: string
    returnDate?: string
    passengers?: string
    cabinClass?: string
  }
}

export default async function FlightSearchPage({ searchParams }: SearchPageProps) {
  try {
    // Validate search params
    const validatedParams = FlightSearchSchema.parse({
      from: searchParams.from,
      to: searchParams.to,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      passengers: searchParams.passengers ? Number.parseInt(searchParams.passengers) : 1,
      cabinClass: searchParams.cabinClass || "economy",
    })

    // Search for flights
    const flights = await searchFlights(validatedParams)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Flight Search Results</h1>

        <div className="mb-6 p-4 bg-muted rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="font-medium">From:</span> {searchParams.from}
            </div>
            <div>
              <span className="font-medium">To:</span> {searchParams.to}
            </div>
            <div>
              <span className="font-medium">Departure:</span> {searchParams.departureDate}
            </div>
            {searchParams.returnDate && (
              <div>
                <span className="font-medium">Return:</span> {searchParams.returnDate}
              </div>
            )}
            <div>
              <span className="font-medium">Passengers:</span> {searchParams.passengers || 1}
            </div>
            <div>
              <span className="font-medium">Class:</span> {searchParams.cabinClass || "Economy"}
            </div>
          </div>
        </div>

        <FlightSearchResults flights={flights} searchParams={searchParams} />
      </div>
    )
  } catch (error) {
    console.error("Error in flight search page:", error)
    return notFound()
  }
}
