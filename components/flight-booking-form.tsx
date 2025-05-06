"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import type { Flight } from "@/lib/db/schema"
import { createFlightBooking } from "@/lib/flight-booking"

const formSchema = z.object({
  passengerName: z.string().min(3, { message: "Passenger name must be at least 3 characters" }),
  passengerEmail: z.string().email({ message: "Please enter a valid email address" }),
  passengerPhone: z.string().min(10, { message: "Please enter a valid phone number" }),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
})

interface FlightBookingFormProps {
  flight: Flight
  userId: string
}

export function FlightBookingForm({ flight, userId }: FlightBookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengerName: "",
      passengerEmail: "",
      passengerPhone: "",
      agreeTerms: false,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      // Create the booking
      const booking = await createFlightBooking({
        userId,
        passengerName: values.passengerName,
        passengerEmail: values.passengerEmail,
        passengerPhone: values.passengerPhone,
        outboundFlight: flight.flightNumber,
        departureAirport: flight.departureAirport,
        departureCode: flight.departureCode,
        arrivalAirport: flight.arrivalAirport,
        arrivalCode: flight.arrivalCode,
        departureDate: flight.departureDate,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        price: flight.price,
        currency: flight.currency,
      })

      toast({
        title: "Booking Created",
        description: `Your booking reference is ${booking.bookingReference}`,
      })

      // Redirect to payment page
      router.push(`/services/flights/payment?bookingId=${booking.id}`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passenger Information</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="passengerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter passenger's full name" {...field} />
                  </FormControl>
                  <FormDescription>Enter the name exactly as it appears on ID/passport</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passengerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormDescription>Booking confirmation will be sent to this email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passengerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormDescription>Include country code (e.g., +234)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I agree to the terms and conditions</FormLabel>
                    <FormDescription>
                      By checking this box, you agree to our{" "}
                      <a href="/terms" className="text-primary underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary underline">
                        Privacy Policy
                      </a>
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
