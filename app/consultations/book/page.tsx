"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { ArrowLeft, Clock, Check } from "lucide-react"
import Link from "next/link"

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

const consultationTypes = [
  {
    id: "migration-uk",
    title: "Expert Legal Guidance for Your Migration Journey",
    description:
      "Get personalized advice on UK visa applications, documentation requirements, and the entire migration process.",
    price: "£99",
    duration: "60 min",
  },
  {
    id: "financial-planning",
    title: "Strategic Financial Planning for The Future",
    description:
      "Plan your finances for before, during, and after migration with expert guidance on international banking, investments, and more.",
    price: "£129",
    duration: "60 min",
  },
  {
    id: "regulatory-compliance",
    title: "Ensuring Adherence to Regulatory Standards",
    description:
      "Navigate complex regulatory requirements with expert guidance to ensure your migration process is fully compliant.",
    price: "£109",
    duration: "60 min",
  },
]

export default function BookConsultationPage() {
  const searchParams = useSearchParams()
  const [consultationType, setConsultationType] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const type = searchParams.get("type")
    if (type) {
      setConsultationType(type)
    }
  }, [searchParams])

  const selectedConsultation = consultationTypes.find((type) => type.id === consultationType)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({
      ...formData,
      date,
      timeSlot,
      consultationType,
    })
    // Show success message
    setStep(3)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/consultations" className="flex items-center text-[#3366FF] hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Consultations
          </Link>
        </div>

        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Expert"
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <div>
                <CardTitle>Book Consultation</CardTitle>
                {selectedConsultation && <CardDescription>{selectedConsultation.title}</CardDescription>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {step === 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Select date and time</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Available time slots</h3>
                    {date ? (
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={timeSlot === time ? "default" : "outline"}
                            className={`justify-start ${timeSlot === time ? "bg-[#3366FF] text-white" : ""}`}
                            onClick={() => setTimeSlot(time)}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">Please select a date first</div>
                    )}

                    {selectedConsultation && (
                      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Consultation Details</h3>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Type:</span> {selectedConsultation.title}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Duration:</span> {selectedConsultation.duration}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Price:</span> {selectedConsultation.price}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!date || !timeSlot}
                    className="bg-[#3366FF] hover:bg-[#2855E0]"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">What would you like to discuss?</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please share any specific questions or concerns you'd like to discuss"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Booking Summary</h3>
                    <div className="space-y-1 mb-4">
                      {selectedConsultation && (
                        <p className="text-sm">
                          <span className="font-medium">Consultation:</span> {selectedConsultation.title}
                        </p>
                      )}
                      {date && (
                        <p className="text-sm">
                          <span className="font-medium">Date:</span> {format(date, "PPP")}
                        </p>
                      )}
                      {timeSlot && (
                        <p className="text-sm">
                          <span className="font-medium">Time:</span> {timeSlot}
                        </p>
                      )}
                      {selectedConsultation && (
                        <p className="text-sm">
                          <span className="font-medium">Price:</span> {selectedConsultation.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#3366FF] hover:bg-[#2855E0]"
                    disabled={!formData.name || !formData.email || !formData.phone}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your consultation has been scheduled successfully. We've sent a confirmation email to {formData.email}
                  with all the details.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6 inline-block">
                  <div className="text-left">
                    {selectedConsultation && (
                      <p className="mb-2">
                        <span className="font-medium">Consultation:</span> {selectedConsultation.title}
                      </p>
                    )}
                    {date && (
                      <p className="mb-2">
                        <span className="font-medium">Date:</span> {format(date, "PPP")}
                      </p>
                    )}
                    {timeSlot && (
                      <p>
                        <span className="font-medium">Time:</span> {timeSlot}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Button className="bg-[#3366FF] hover:bg-[#2855E0]" asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
