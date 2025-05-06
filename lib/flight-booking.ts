import { createClient } from "@/lib/supabase/server"
import { type FlightBooking, FlightBookingSchema, type FlightSearch, type Flight } from "@/lib/db/schema"
import { sendTemplateEmail } from "@/lib/email"

// Mock data for flights (in a real app, this would come from an API)
const mockAirports = [
  { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria" },
  { code: "ABV", name: "Nnamdi Azikiwe International Airport", city: "Abuja", country: "Nigeria" },
  { code: "PHC", name: "Port Harcourt International Airport", city: "Port Harcourt", country: "Nigeria" },
  { code: "LHR", name: "Heathrow Airport", city: "London", country: "United Kingdom" },
  { code: "JFK", name: "John F. Kennedy International Airport", city: "New York", country: "United States" },
  { code: "YYZ", name: "Toronto Pearson International Airport", city: "Toronto", country: "Canada" },
  { code: "DXB", name: "Dubai International Airport", city: "Dubai", country: "United Arab Emirates" },
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "AMS", name: "Amsterdam Airport Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
]

// Get all airports
export async function getAirports() {
  return mockAirports
}

// Search for airports by query
export async function searchAirports(query: string) {
  if (!query || query.length < 2) return []

  const lowerQuery = query.toLowerCase()
  return mockAirports.filter(
    (airport) =>
      airport.code.toLowerCase().includes(lowerQuery) ||
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.city.toLowerCase().includes(lowerQuery) ||
      airport.country.toLowerCase().includes(lowerQuery),
  )
}

// Generate mock flights based on search criteria
export async function searchFlights(search: FlightSearch): Promise<Flight[]> {
  const { from, to, departureDate, cabinClass } = search

  // In a real app, this would call an external API
  const mockFlights: Flight[] = []

  // Find the departure and arrival airports
  const fromAirport = mockAirports.find((a) => a.code === from)
  const toAirport = mockAirports.find((a) => a.code === to)

  if (!fromAirport || !toAirport) {
    return []
  }

  // Generate 3-5 random flights
  const numFlights = Math.floor(Math.random() * 3) + 3
  const airlines = ["Cush Airways", "Nigeria Air", "British Airways", "Emirates", "Air France", "KLM", "Lufthansa"]

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const flightNumber = `${airline.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000) + 100}`

    // Generate random departure time between 6am and 10pm
    const departureHour = Math.floor(Math.random() * 16) + 6
    const departureMinute = Math.floor(Math.random() * 4) * 15
    const departureTimeStr = `${departureHour.toString().padStart(2, "0")}:${departureMinute.toString().padStart(2, "0")}`

    // Generate random duration between 1h30m and 14h
    const durationHours = Math.floor(Math.random() * 13) + 1
    const durationMinutes = Math.floor(Math.random() * 4) * 15
    const durationStr = `${durationHours}h ${durationMinutes}m`

    // Calculate arrival time
    const departureDate = new Date()
    departureDate.setHours(departureHour, departureMinute, 0, 0)
    const arrivalDate = new Date(departureDate.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000)
    const arrivalTimeStr = `${arrivalDate.getHours().toString().padStart(2, "0")}:${arrivalDate.getMinutes().toString().padStart(2, "0")}`

    // Generate price based on cabin class
    let basePrice = Math.floor(Math.random() * 300) + 200
    switch (cabinClass) {
      case "premium":
        basePrice *= 1.5
        break
      case "business":
        basePrice *= 3
        break
      case "first":
        basePrice *= 5
        break
    }

    mockFlights.push({
      id: `flight-${i}-${Date.now()}`,
      airline,
      flightNumber,
      departureAirport: fromAirport.name,
      departureCode: fromAirport.code,
      arrivalAirport: toAirport.name,
      arrivalCode: toAirport.code,
      departureDate,
      departureTime: departureTimeStr,
      arrivalTime: arrivalTimeStr,
      duration: durationStr,
      price: basePrice,
      currency: "USD",
      seatsAvailable: Math.floor(Math.random() * 50) + 1,
      cabinClass,
    })
  }

  return mockFlights
}

// Create a new flight booking
export async function createFlightBooking(
  bookingData: Omit<FlightBooking, "id" | "bookingReference" | "createdAt" | "updatedAt">,
): Promise<FlightBooking> {
  const supabase = createClient()

  // Generate a unique booking reference
  const bookingReference = generateBookingReference()

  // Prepare the booking data
  const booking: FlightBooking = {
    ...bookingData,
    bookingReference,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Validate the booking data
  const validatedBooking = FlightBookingSchema.parse(booking)

  // Insert the booking into the database
  const { data, error } = await supabase
    .from("flight_bookings")
    .insert({
      user_id: validatedBooking.userId,
      booking_reference: validatedBooking.bookingReference,
      passenger_name: validatedBooking.passengerName,
      passenger_email: validatedBooking.passengerEmail,
      passenger_phone: validatedBooking.passengerPhone,
      outbound_flight: validatedBooking.outboundFlight,
      departure_airport: validatedBooking.departureAirport,
      departure_code: validatedBooking.departureCode,
      arrival_airport: validatedBooking.arrivalAirport,
      arrival_code: validatedBooking.arrivalCode,
      departure_date: validatedBooking.departureDate,
      departure_time: validatedBooking.departureTime,
      arrival_time: validatedBooking.arrivalTime,
      return_flight: validatedBooking.returnFlight,
      return_departure_airport: validatedBooking.returnDepartureAirport,
      return_departure_code: validatedBooking.returnDepartureCode,
      return_arrival_airport: validatedBooking.returnArrivalAirport,
      return_arrival_code: validatedBooking.returnArrivalCode,
      return_date: validatedBooking.returnDate,
      return_departure_time: validatedBooking.returnDepartureTime,
      return_arrival_time: validatedBooking.returnArrivalTime,
      price: validatedBooking.price,
      currency: validatedBooking.currency,
      status: validatedBooking.status,
      payment_id: validatedBooking.paymentId,
      payment_method: validatedBooking.paymentMethod,
    })
    .select("*")
    .single()

  if (error) {
    console.error("Error creating flight booking:", error)
    throw new Error(`Failed to create flight booking: ${error.message}`)
  }

  // Map the database response to our schema
  const createdBooking: FlightBooking = {
    id: data.id,
    userId: data.user_id,
    bookingReference: data.booking_reference,
    passengerName: data.passenger_name,
    passengerEmail: data.passenger_email,
    passengerPhone: data.passenger_phone,
    outboundFlight: data.outbound_flight,
    departureAirport: data.departure_airport,
    departureCode: data.departure_code,
    arrivalAirport: data.arrival_airport,
    arrivalCode: data.arrival_code,
    departureDate: data.departure_date,
    departureTime: data.departure_time,
    arrivalTime: data.arrival_time,
    returnFlight: data.return_flight,
    returnDepartureAirport: data.return_departure_airport,
    returnDepartureCode: data.return_departure_code,
    returnArrivalAirport: data.return_arrival_airport,
    returnArrivalCode: data.return_arrival_code,
    returnDate: data.return_date,
    returnDepartureTime: data.return_departure_time,
    returnArrivalTime: data.return_arrival_time,
    price: data.price,
    currency: data.currency,
    status: data.status,
    paymentId: data.payment_id,
    paymentMethod: data.payment_method,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }

  return createdBooking
}

// Get a flight booking by ID
export async function getFlightBookingById(id: string): Promise<FlightBooking | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("flight_bookings").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching flight booking:", error)
    return null
  }

  if (!data) {
    return null
  }

  // Map the database response to our schema
  const booking: FlightBooking = {
    id: data.id,
    userId: data.user_id,
    bookingReference: data.booking_reference,
    passengerName: data.passenger_name,
    passengerEmail: data.passenger_email,
    passengerPhone: data.passenger_phone,
    outboundFlight: data.outbound_flight,
    departureAirport: data.departure_airport,
    departureCode: data.departure_code,
    arrivalAirport: data.arrival_airport,
    arrivalCode: data.arrival_code,
    departureDate: data.departure_date,
    departureTime: data.departure_time,
    arrivalTime: data.arrival_time,
    returnFlight: data.return_flight,
    returnDepartureAirport: data.return_departure_airport,
    returnDepartureCode: data.return_departure_code,
    returnArrivalAirport: data.return_arrival_airport,
    returnArrivalCode: data.return_arrival_code,
    returnDate: data.return_date,
    returnDepartureTime: data.return_departure_time,
    returnArrivalTime: data.return_arrival_time,
    price: data.price,
    currency: data.currency,
    status: data.status,
    paymentId: data.payment_id,
    paymentMethod: data.payment_method,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }

  return booking
}

// Get flight bookings for a user
export async function getUserFlightBookings(userId: string): Promise<FlightBooking[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("flight_bookings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user flight bookings:", error)
    return []
  }

  // Map the database response to our schema
  const bookings: FlightBooking[] = data.map((item) => ({
    id: item.id,
    userId: item.user_id,
    bookingReference: item.booking_reference,
    passengerName: item.passenger_name,
    passengerEmail: item.passenger_email,
    passengerPhone: item.passenger_phone,
    outboundFlight: item.outbound_flight,
    departureAirport: item.departure_airport,
    departureCode: item.departure_code,
    arrivalAirport: item.arrival_airport,
    arrivalCode: item.arrival_code,
    departureDate: item.departure_date,
    departureTime: item.departure_time,
    arrivalTime: item.arrival_time,
    returnFlight: item.return_flight,
    returnDepartureAirport: item.return_departure_airport,
    returnDepartureCode: item.return_departure_code,
    returnArrivalAirport: item.return_arrival_airport,
    returnArrivalCode: item.return_arrival_code,
    returnDate: item.return_date,
    returnDepartureTime: item.return_departure_time,
    returnArrivalTime: item.return_arrival_time,
    price: item.price,
    currency: item.currency,
    status: item.status,
    paymentId: item.payment_id,
    paymentMethod: item.payment_method,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
  }))

  return bookings
}

// Update a flight booking
export async function updateFlightBooking(id: string, updates: Partial<FlightBooking>): Promise<FlightBooking | null> {
  const supabase = createClient()

  // Prepare the update data
  const updateData: Record<string, any> = {}

  if (updates.status) updateData.status = updates.status
  if (updates.paymentId) updateData.payment_id = updates.paymentId
  if (updates.paymentMethod) updateData.payment_method = updates.paymentMethod

  updateData.updated_at = new Date().toISOString()

  // Update the booking in the database
  const { data, error } = await supabase.from("flight_bookings").update(updateData).eq("id", id).select("*").single()

  if (error) {
    console.error("Error updating flight booking:", error)
    return null
  }

  // Map the database response to our schema
  const updatedBooking: FlightBooking = {
    id: data.id,
    userId: data.user_id,
    bookingReference: data.booking_reference,
    passengerName: data.passenger_name,
    passengerEmail: data.passenger_email,
    passengerPhone: data.passenger_phone,
    outboundFlight: data.outbound_flight,
    departureAirport: data.departure_airport,
    departureCode: data.departure_code,
    arrivalAirport: data.arrival_airport,
    arrivalCode: data.arrival_code,
    departureDate: data.departure_date,
    departureTime: data.departure_time,
    arrivalTime: data.arrival_time,
    returnFlight: data.return_flight,
    returnDepartureAirport: data.return_departure_airport,
    returnDepartureCode: data.return_departure_code,
    returnArrivalAirport: data.return_arrival_airport,
    returnArrivalCode: data.return_arrival_code,
    returnDate: data.return_date,
    returnDepartureTime: data.return_departure_time,
    returnArrivalTime: data.return_arrival_time,
    price: data.price,
    currency: data.currency,
    status: data.status,
    paymentId: data.payment_id,
    paymentMethod: data.payment_method,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }

  return updatedBooking
}

// Confirm a flight booking
export async function confirmFlightBooking(
  id: string,
  paymentId: string,
  paymentMethod: string,
): Promise<FlightBooking | null> {
  const booking = await updateFlightBooking(id, {
    status: "confirmed",
    paymentId,
    paymentMethod,
  })

  if (booking) {
    // Send confirmation email
    await sendFlightBookingConfirmationEmail(booking)
  }

  return booking
}

// Cancel a flight booking
export async function cancelFlightBooking(id: string): Promise<FlightBooking | null> {
  return updateFlightBooking(id, {
    status: "cancelled",
  })
}

// Send flight booking confirmation email
export async function sendFlightBookingConfirmationEmail(booking: FlightBooking): Promise<boolean> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const bookingDetailsUrl = `${appUrl}/dashboard/flights/${booking.id}`

    const emailResult = await sendTemplateEmail({
      to: booking.passengerEmail,
      templateName: "flightBookingConfirmation",
      variables: {
        name: booking.passengerName,
        bookingReference: booking.bookingReference,
        passengerName: booking.passengerName,
        outboundFlight: booking.outboundFlight,
        departureAirport: booking.departureAirport,
        departureCode: booking.departureCode,
        arrivalAirport: booking.arrivalAirport,
        arrivalCode: booking.arrivalCode,
        departureDate: booking.departureDate,
        departureTime: booking.departureTime,
        arrivalTime: booking.arrivalTime,
        returnFlight: booking.returnFlight,
        returnDepartureAirport: booking.returnDepartureAirport,
        returnDepartureCode: booking.returnDepartureCode,
        returnArrivalAirport: booking.returnArrivalAirport,
        returnArrivalCode: booking.returnArrivalCode,
        returnDate: booking.returnDate,
        returnDepartureTime: booking.returnDepartureTime,
        returnArrivalTime: booking.returnArrivalTime,
        bookingDetailsUrl,
      },
    })

    return emailResult.success
  } catch (error) {
    console.error("Error sending flight booking confirmation email:", error)
    return false
  }
}

// Generate a unique booking reference
function generateBookingReference(): string {
  // Generate a random 6-character alphanumeric string
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let reference = ""
  for (let i = 0; i < 6; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `CU${reference}`
}
