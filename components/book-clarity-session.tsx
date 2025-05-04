"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
    title: "UK Migration Consultation",
    description: "Expert guidance for UK visa applications, documentation, and migration process.",
  },
  {
    id: "migration-global",
    title: "Global Migration Consultation",
    description: "Guidance for migration to countries worldwide, including documentation and requirements.",
  },
  {
    id: "financial-planning",
    title: "Financial Planning Consultation",
    description: "Strategic financial planning for your migration journey and future goals.",
  },
  {
    id: "regulatory-compliance",
    title: "Regulatory Compliance Consultation",
    description: "Ensure adherence to regulatory standards for your migration and financial needs.",
  },
]

export function BookClaritySession() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined)
  const [consultationType, setConsultationType] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

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
    // Show success message or redirect
    setStep(3)
  }

  const resetForm = () => {
    setDate(undefined)
    setTimeSlot(undefined)
    setConsultationType(undefined)
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    })
    setStep(1)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3366FF] hover:bg-[#2855E0]">Book a Clarity Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Book a Clarity Session</DialogTitle>
              <DialogDescription>
                Choose the type of consultation you need for your migration journey.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {consultationTypes.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    "cursor-pointer hover:border-[#3366FF] transition-colors",
                    consultationType === type.id ? "border-[#3366FF] bg-[#3366FF]/5" : "",
                  )}
                  onClick={() => setConsultationType(type.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{type.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button
                onClick={() => setStep(2)}
                disabled={!consultationType}
                className="bg-[#3366FF] hover:bg-[#2855E0]"
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>Select Date and Time</DialogTitle>
              <DialogDescription>Choose a convenient date and time for your clarity session.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time">
                          {timeSlot ? (
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {timeSlot}
                            </div>
                          ) : (
                            "Select time"
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please share any specific questions or concerns you'd like to discuss"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!date || !timeSlot || !formData.name || !formData.email || !formData.phone}
                  className="bg-[#3366FF] hover:bg-[#2855E0]"
                >
                  Book Session
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle>Booking Confirmed!</DialogTitle>
              <DialogDescription>Your clarity session has been scheduled successfully.</DialogDescription>
            </DialogHeader>
            <div className="py-6 text-center">
              <div className="mb-4 mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Thank you for booking a clarity session!</h3>
              <p className="text-gray-500 mb-4">
                We've sent a confirmation email to {formData.email} with all the details.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 inline-block">
                <div className="text-left">
                  <p className="mb-1">
                    <span className="font-medium">Date:</span> {date ? format(date, "PPP") : ""}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Time:</span> {timeSlot}
                  </p>
                  <p>
                    <span className="font-medium">Consultation:</span>{" "}
                    {consultationTypes.find((type) => type.id === consultationType)?.title}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={resetForm} className="bg-[#3366FF] hover:bg-[#2855E0]">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
