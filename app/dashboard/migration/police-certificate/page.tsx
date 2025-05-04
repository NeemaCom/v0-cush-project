"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import { Check, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { saveApplication } from "@/lib/redis"
import { createPaymentIntent } from "@/lib/stripe"

const certificateSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  placeOfBirth: z.string().min(2, { message: "Place of birth is required" }),
  nationality: z.string().min(2, { message: "Nationality is required" }),
  passportNumber: z.string().min(2, { message: "Passport number is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  address: z.string().min(5, { message: "Current address is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(5, { message: "Phone number is required" }),
  purpose: z.string().min(5, { message: "Purpose is required" }),
  deliveryMethod: z.string().min(1, { message: "Delivery method is required" }),
  processingTime: z.string().min(1, { message: "Processing time is required" }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export default function PoliceCertificatePage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [applicationData, setApplicationData] = useState<any>(null)

  const form = useForm<z.infer<typeof certificateSchema>>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      nationality: "",
      passportNumber: "",
      gender: "",
      address: "",
      email: "",
      phone: "",
      purpose: "",
      deliveryMethod: "",
      processingTime: "",
      termsAccepted: false,
    },
  })

  async function onSubmit(values: z.infer<typeof certificateSchema>) {
    setIsSubmitting(true)

    try {
      // Calculate price based on processing time
      let price = 0
      switch (values.processingTime) {
        case "standard":
          price = 100
          break
        case "express":
          price = 150
          break
        case "urgent":
          price = 200
          break
        default:
          price = 100
      }

      // Add delivery fee if applicable
      if (values.deliveryMethod === "courier") {
        price += 30
      }

      // Generate a unique ID for the application
      const applicationId = uuidv4()

      // In a real app, you would get the user ID from authentication
      const userId = "user123"

      const applicationData = {
        id: applicationId,
        userId,
        status: "pending_payment",
        createdAt: new Date().toISOString(),
        price,
        ...values,
      }

      // Save the application to Redis
      await saveApplication("police-certificate", applicationId, applicationData)

      setApplicationData(applicationData)
      setStep(2)
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePayment() {
    setIsSubmitting(true)

    try {
      // Create a payment intent with Stripe
      const { clientSecret, id } = await createPaymentIntent(applicationData.price * 100)

      // In a real app, you would redirect to a payment page or show a payment form
      // For this example, we'll simulate a successful payment

      // Update application status to paid
      applicationData.status = "paid"
      await saveApplication("police-certificate", applicationData.id, applicationData)

      setIsSuccess(true)
      setStep(3)
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Police Character Certificate</h1>
        <p className="text-gray-500">Apply for your police character certificate online</p>
      </header>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <div className={`h-1 w-16 ${step >= 3 ? "bg-primary" : "bg-gray-200"}`}></div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              3
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {step === 1 && "Application Details"}
            {step === 2 && "Payment"}
            {step === 3 && "Confirmation"}
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Please fill out all the required information to apply for your police character certificate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name (as in passport)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="placeOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Birth</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Your nationality" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passportNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter passport number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your current address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Certificate Details</h3>

                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose of Certificate</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Explain why you need this certificate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email (PDF)</SelectItem>
                            <SelectItem value="courier">International Courier (+$30)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="processingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processing Time</FormLabel>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <FormItem className="flex flex-col items-center space-x-0 space-y-2 border rounded-md p-4">
                            <FormControl>
                              <RadioGroupItem value="standard" className="sr-only" />
                            </FormControl>
                            <div
                              className={`w-full p-2 rounded-md text-center ${field.value === "standard" ? "bg-primary/10 text-primary" : ""}`}
                            >
                              <div className="font-semibold">Standard</div>
                              <div className="text-sm text-gray-500">10-15 working days</div>
                              <div className="font-bold mt-2">$100</div>
                            </div>
                          </FormItem>
                          <FormItem className="flex flex-col items-center space-x-0 space-y-2 border rounded-md p-4">
                            <FormControl>
                              <RadioGroupItem value="express" className="sr-only" />
                            </FormControl>
                            <div
                              className={`w-full p-2 rounded-md text-center ${field.value === "express" ? "bg-primary/10 text-primary" : ""}`}
                            >
                              <div className="font-semibold">Express</div>
                              <div className="text-sm text-gray-500">5-7 working days</div>
                              <div className="font-bold mt-2">$150</div>
                            </div>
                          </FormItem>
                          <FormItem className="flex flex-col items-center space-x-0 space-y-2 border rounded-md p-4">
                            <FormControl>
                              <RadioGroupItem value="urgent" className="sr-only" />
                            </FormControl>
                            <div
                              className={`w-full p-2 rounded-md text-center ${field.value === "urgent" ? "bg-primary/10 text-primary" : ""}`}
                            >
                              <div className="font-semibold">Urgent</div>
                              <div className="text-sm text-gray-500">2-3 working days</div>
                              <div className="font-bold mt-2">$200</div>
                            </div>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the terms and conditions and confirm that all information provided is accurate.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === 2 && applicationData && (
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>
              Please review your application details and complete the payment to submit your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-semibold">Application Summary</h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Full Name:</div>
                  <div>{applicationData.fullName}</div>

                  <div className="text-gray-500">Passport Number:</div>
                  <div>{applicationData.passportNumber}</div>

                  <div className="text-gray-500">Processing Time:</div>
                  <div className="capitalize">{applicationData.processingTime}</div>

                  <div className="text-gray-500">Delivery Method:</div>
                  <div className="capitalize">{applicationData.deliveryMethod}</div>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-4">Payment Details</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Certificate Fee:</span>
                    <span>
                      $
                      {applicationData.processingTime === "standard"
                        ? "100"
                        : applicationData.processingTime === "express"
                          ? "150"
                          : "200"}
                    </span>
                  </div>

                  {applicationData.deliveryMethod === "courier" && (
                    <div className="flex justify-between">
                      <span>Courier Fee:</span>
                      <span>$30</span>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                    <span>Total:</span>
                    <span>${applicationData.price}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Card Number</label>
                        <Input placeholder="4242 4242 4242 4242" disabled={isSubmitting} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500 mb-1 block">Expiry Date</label>
                          <Input placeholder="MM/YY" disabled={isSubmitting} />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 mb-1 block">CVC</label>
                          <Input placeholder="123" disabled={isSubmitting} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" onClick={handlePayment} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : `Pay $${applicationData.price}`}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setStep(1)} disabled={isSubmitting}>
              Back to Application
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && isSuccess && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">Application Submitted!</CardTitle>
            <CardDescription className="text-center">
              Your police character certificate application has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 space-y-4">
              <h3 className="font-semibold">Application Details</h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Application ID:</div>
                <div>{applicationData.id}</div>

                <div className="text-gray-500">Status:</div>
                <div>Processing</div>

                <div className="text-gray-500">Estimated Completion:</div>
                <div>
                  {applicationData.processingTime === "standard"
                    ? "10-15 working days"
                    : applicationData.processingTime === "express"
                      ? "5-7 working days"
                      : "2-3 working days"}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md text-blue-700 text-sm">
                <p>
                  We will send you email updates about your application status. You can also check the status in your
                  dashboard.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => (window.location.href = "/dashboard/migration")}>Go to Migration Dashboard</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
