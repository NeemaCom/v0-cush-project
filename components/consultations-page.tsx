"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export function ConsultationsPage() {
  const consultationTypes = [
    {
      id: "migration-uk",
      title: "Expert Legal Guidance for Your Migration Journey",
      description:
        "Get personalized advice on UK visa applications, documentation requirements, and the entire migration process.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "financial-planning",
      title: "Strategic Financial Planning for The Future",
      description:
        "Plan your finances for before, during, and after migration with expert guidance on international banking, investments, and more.",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "regulatory-compliance",
      title: "Ensuring Adherence to Regulatory Standards",
      description:
        "Navigate complex regulatory requirements with expert guidance to ensure your migration process is fully compliant.",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Expert Clarity Sessions for Your Migration Journey
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Book a one-on-one consultation with our migration and financial experts to get personalized guidance for your
          specific situation.
        </p>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-2">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">Book Your Expert Migration Consultation</h2>
              <p className="text-gray-600 mb-6">
                Our clarity sessions provide personalized guidance to help you navigate the complexities of migration
                and financial planning.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#3366FF] flex items-center justify-center mt-1">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Choose your consultation type</h3>
                    <p className="text-sm text-gray-500">Select the type of guidance you need for your journey</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#3366FF] flex items-center justify-center mt-1">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Select a convenient date and time</h3>
                    <p className="text-sm text-gray-500">Choose from our available slots for your session</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-[#3366FF] flex items-center justify-center mt-1">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Receive personalized guidance</h3>
                    <p className="text-sm text-gray-500">Get expert advice tailored to your specific situation</p>
                  </div>
                </div>
              </div>
              <Button className="bg-[#3366FF] hover:bg-[#2855E0] w-full" asChild>
                <Link href="#consultation-types">View Consultation Types</Link>
              </Button>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image src="/placeholder.svg?height=400&width=500" alt="Consultation" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div id="consultation-types" className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Consultation Offered</h2>
        <div className="grid md:grid-cols-1 gap-8">
          {consultationTypes.map((consultation, index) => (
            <Card key={consultation.id} className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6">
                  <CardTitle className="text-xl mb-3">{consultation.title}</CardTitle>
                  <CardDescription className="text-gray-600 mb-6">{consultation.description}</CardDescription>
                  <Button className="bg-[#3366FF] hover:bg-[#2855E0]" asChild>
                    <Link href={`/consultations/book?type=${consultation.id}`}>Book Now</Link>
                  </Button>
                </div>
                <div className="relative h-48 md:h-auto">
                  <Image
                    src={consultation.image || "/placeholder.svg"}
                    alt={consultation.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Teamwork Is The Guiding Principle That Defines Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Teamwork"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Innovation"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Expertise"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Support"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </div>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">You know what's best for you</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          We're here to guide you based on your specific needs and circumstances. Our experts provide personalized
          advice tailored to your unique migration journey.
        </p>
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#3366FF]/10 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#3366FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Secure Process</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your information is protected with bank-level security throughout the consultation process.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#3366FF]/10 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#3366FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Time-Saving</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get expert guidance quickly without spending hours researching complex migration processes.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#3366FF]/10 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#3366FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="font-medium">Personalized</h3>
            </div>
            <p className="text-sm text-gray-600">
              Receive advice tailored to your specific situation, goals, and migration needs.
            </p>
          </Card>
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-[#3366FF]/10 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#3366FF]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium">Expert Guidance</h3>
            </div>
            <p className="text-sm text-gray-600">
              Connect with professionals who have extensive experience in migration and financial advisory.
            </p>
          </Card>
        </div>
      </div>

      <div className="bg-[#3366FF] text-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">We're here to help - Reach Out Anytime!</h2>
          <p>Have questions about our consultation services? Our team is ready to assist you.</p>
        </div>
        <Button className="bg-white text-[#3366FF] hover:bg-blue-50 mt-4 md:mt-0" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
