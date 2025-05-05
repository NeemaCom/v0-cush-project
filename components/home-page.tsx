"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-[#3366FF] shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-white"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-2xl font-bold text-white">Cush</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-white hover:text-blue-100">
              Home
            </Link>
            <Link href="/services" className="text-white hover:text-blue-100">
              Services
            </Link>
            <Link href="/about" className="text-white hover:text-blue-100">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-100">
              Contact
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="/login" className="px-4 py-2 text-white hover:text-blue-100 border border-transparent">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-white text-[#3366FF] rounded-md hover:bg-blue-50">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 bg-[#3366FF] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="wave" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 25C 40 10, 60 40, 100 25C 140 10, 160 40, 200 25L 200 0L 0 0Z"
                    fill="white"
                    opacity="0.4"
                  />
                </pattern>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#wave)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Simplify Your Migration Journey & Financial Payments
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Expert guidance for UK and global migration with seamless payment solutions for your international
                needs.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-white text-[#3366FF] hover:bg-blue-50">Get Started</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Migration Services"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 mb-6">Trusted by individuals and businesses worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {["Barclays", "HSBC", "Capita", "JP Morgan", "Deloitte", "KPMG"].map((partner) => (
                <div key={partner} className="grayscale opacity-70 hover:opacity-100 transition-opacity">
                  <span className="font-bold text-gray-400">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Book Clarity Session CTA */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Need Expert Guidance?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Book a clarity session with our migration and financial experts to get personalized advice for your
                specific situation.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Consultation"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Book a Clarity Session Today</h3>
                  <p className="text-gray-600 mb-6">
                    Our experts will help you understand the migration process, required documents, financial
                    considerations, and answer all your questions.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3366FF] mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Personalized migration advice</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3366FF] mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Financial planning guidance</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#3366FF] mr-2 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Document review and assistance</span>
                    </li>
                  </ul>
                  <Button className="bg-[#3366FF] hover:bg-[#2855E0]" asChild>
                    <Link href="/consultations">Book a Clarity Session</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive migration and financial solutions to make your international journey seamless.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 text-[#3366FF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Migration Advisory</h3>
                <p className="text-gray-600 mb-4">
                  Expert guidance on migration processes for UK and global destinations with document assistance.
                </p>
                <Link href="/services/migration" className="text-[#3366FF] font-medium hover:underline">
                  Learn more →
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 text-[#3366FF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Virtual Cards</h3>
                <p className="text-gray-600 mb-4">
                  Access virtual dollar cards for seamless online transactions and subscriptions worldwide.
                </p>
                <Link href="/services/cards" className="text-[#3366FF] font-medium hover:underline">
                  Learn more →
                </Link>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4 text-[#3366FF]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Money Transfers</h3>
                <p className="text-gray-600 mb-4">
                  Send and receive money across currencies and borders with competitive rates and low fees.
                </p>
                <Link href="/services/transfers" className="text-[#3366FF] font-medium hover:underline">
                  Learn more →
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple steps to start your migration journey and manage your finances with Cush.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-[#3366FF]/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#3366FF] text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for a free account to access our migration advisory and financial services.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#3366FF]/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#3366FF] text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book a Consultation</h3>
                <p className="text-gray-600">
                  Schedule a clarity session with our experts to discuss your migration and financial needs.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#3366FF]/10 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#3366FF] text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Personalized Solutions</h3>
                <p className="text-gray-600">
                  Receive tailored guidance and access our financial tools to support your migration journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from individuals and businesses who have successfully navigated their migration journey with Cush.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    JD
                  </div>
                  <div>
                    <h4 className="font-semibold">John Doe</h4>
                    <p className="text-sm text-gray-500">Migrated from Nigeria to UK</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Cush made my migration to the UK incredibly smooth. Their guidance on visa applications and financial
                  setup saved me countless hours and stress."
                </p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    JS
                  </div>
                  <div>
                    <h4 className="font-semibold">Jane Smith</h4>
                    <p className="text-sm text-gray-500">Migrated from Ghana to Canada</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The virtual card service was a lifesaver during my transition period. I could make payments globally
                  without any hassle while my migration was in process."
                </p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    RJ
                  </div>
                  <div>
                    <h4 className="font-semibold">Robert Johnson</h4>
                    <p className="text-sm text-gray-500">Business owner in Kenya</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Their clarity sessions provided invaluable insights for my business expansion to the UK. The
                  financial advisory services helped me navigate complex regulations."
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#3366FF] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Migration Journey?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Join thousands of satisfied customers who have successfully migrated and managed their finances with our
              help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-[#3366FF] hover:bg-blue-50" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button variant="outline" className="border-white hover:bg-white/10" asChild>
                <Link href="/consultations">Book a Clarity Session</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span className="text-xl font-bold">Cush</span>
              </div>
              <p className="text-gray-400">
                Your complete migration advisory and payment solutions platform. Making international transitions
                seamless since 2023.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/services/migration" className="text-gray-400 hover:text-white">
                    Migration Advisory
                  </Link>
                </li>
                <li>
                  <Link href="/services/cards" className="text-gray-400 hover:text-white">
                    Virtual Cards
                  </Link>
                </li>
                <li>
                  <Link href="/services/transfers" className="text-gray-400 hover:text-white">
                    Money Transfers
                  </Link>
                </li>
                <li>
                  <Link href="/consultations" className="text-gray-400 hover:text-white">
                    Clarity Sessions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/compliance" className="text-gray-400 hover:text-white">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Cush. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
