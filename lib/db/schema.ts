import { z } from "zod"

// Email Template Schema
export const EmailTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Template name is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  html: z.string().min(1, "HTML content is required"),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type EmailTemplate = z.infer<typeof EmailTemplateSchema>

// Flight booking schema
export const FlightBookingSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  bookingReference: z.string(),
  passengerName: z.string(),
  passengerEmail: z.string().email(),
  passengerPhone: z.string().optional(),
  outboundFlight: z.string(),
  departureAirport: z.string(),
  departureCode: z.string(),
  arrivalAirport: z.string(),
  arrivalCode: z.string(),
  departureDate: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  returnFlight: z.string().optional(),
  returnDepartureAirport: z.string().optional(),
  returnDepartureCode: z.string().optional(),
  returnArrivalAirport: z.string().optional(),
  returnArrivalCode: z.string().optional(),
  returnDate: z.string().optional(),
  returnDepartureTime: z.string().optional(),
  returnArrivalTime: z.string().optional(),
  price: z.number(),
  currency: z.string().default("USD"),
  status: z.enum(["pending", "confirmed", "cancelled"]).default("pending"),
  paymentId: z.string().optional(),
  paymentMethod: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type FlightBooking = z.infer<typeof FlightBookingSchema>

// Flight search schema
export const FlightSearchSchema = z.object({
  from: z.string(),
  to: z.string(),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.number().int().min(1).max(9).default(1),
  cabinClass: z.enum(["economy", "premium", "business", "first"]).default("economy"),
})

export type FlightSearch = z.infer<typeof FlightSearchSchema>

// Airport schema
export const AirportSchema = z.object({
  code: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
})

export type Airport = z.infer<typeof AirportSchema>

// Flight schema
export const FlightSchema = z.object({
  id: z.string(),
  airline: z.string(),
  flightNumber: z.string(),
  departureAirport: z.string(),
  departureCode: z.string(),
  arrivalAirport: z.string(),
  arrivalCode: z.string(),
  departureDate: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  duration: z.string(),
  price: z.number(),
  currency: z.string().default("USD"),
  seatsAvailable: z.number().int(),
  cabinClass: z.enum(["economy", "premium", "business", "first"]),
})

export type Flight = z.infer<typeof FlightSchema>
