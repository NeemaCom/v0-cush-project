import Link from "next/link"
import { ArrowLeft, ArrowRight, Globe, QrCode, Send, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransfersPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-teal-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Money Transfers</h1>
        <p className="text-gray-500 max-w-3xl">
          Send and receive money across currencies and borders with ease. Our platform offers multiple transfer methods
          including QR codes, payment links, and bank transfers.
        </p>
      </div>

      {/* Transfer Methods */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Transfer Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="mb-2">
                <QrCode className="h-10 w-10 text-teal-600" />
              </div>
              <CardTitle>QR Code Transfers</CardTitle>
              <CardDescription>Quick and easy transfers using QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate a QR code for others to scan and send you money instantly, or scan someone else's code to send
                them funds.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transfer Fee</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Processing Time</span>
                  <span className="font-medium">Instant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Limit</span>
                  <span className="font-medium">$5,000/day</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Try QR Transfer</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Send className="h-10 w-10 text-teal-600" />
              </div>
              <CardTitle>Payment Links</CardTitle>
              <CardDescription>Create and share payment links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Generate payment links that you can share via email, SMS, or social media for quick money collection.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transfer Fee</span>
                  <span className="font-medium">0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Processing Time</span>
                  <span className="font-medium">Instant</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Limit</span>
                  <span className="font-medium">$10,000/day</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Create Payment Link</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2">
                <Globe className="h-10 w-10 text-teal-600" />
              </div>
              <CardTitle>International Transfers</CardTitle>
              <CardDescription>Send money across borders</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Transfer money internationally with competitive exchange rates and low fees to over 100 countries.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Transfer Fee</span>
                  <span className="font-medium">From 1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Processing Time</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Limit</span>
                  <span className="font-medium">$50,000/day</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Internationally</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 bg-slate-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <span className="text-teal-600 text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Choose Method</h3>
            <p className="text-gray-600">Select your preferred transfer method based on your needs.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <span className="text-teal-600 text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Enter Details</h3>
            <p className="text-gray-600">Provide recipient information and the amount to send.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <span className="text-teal-600 text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
            <p className="text-gray-600">Verify all details and confirm the transaction.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <span className="text-teal-600 text-xl font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Transfer</h3>
            <p className="text-gray-600">Monitor your transfer status in real-time from your dashboard.</p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Popular Transfer Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nigeria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="font-medium">From 0.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-medium">1-2 hours</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/services/transfers/nigeria">
                  Send to Nigeria <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">United Kingdom</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="font-medium">From 0.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-medium">Instant</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/services/transfers/uk">
                  Send to UK <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">United States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="font-medium">From 0.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-medium">1 business day</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/services/transfers/us">
                  Send to US <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">European Union</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Fee</span>
                  <span className="font-medium">From 0.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Time</span>
                  <span className="font-medium">1 business day</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/services/transfers/eu">
                  Send to EU <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Mobile App */}
      <section className="mb-16 bg-teal-600 text-white p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Transfer On The Go</h2>
            <p className="mb-6">
              Download our mobile app to send and receive money from anywhere, anytime. Track your transfers, manage
              recipients, and get real-time notifications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5" />
                Download App
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-teal-600"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg w-64 h-96">
              <div className="bg-gray-100 rounded h-full flex items-center justify-center">
                <p className="text-gray-500 text-center">Mobile App Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>
                <blockquote className="mb-4">
                  "The international transfer service is amazing. I send money to my family in Nigeria every month, and
                  it's always fast and reliable with great exchange rates."
                </blockquote>
                <div>
                  <p className="font-semibold">Michael Okonkwo</p>
                  <p className="text-sm text-gray-500">London, UK</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>
                <blockquote className="mb-4">
                  "The QR code transfer feature is so convenient. I use it to split bills with friends and it's instant
                  with no fees. Couldn't be happier!"
                </blockquote>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 text-teal-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-10 w-10"
                  >
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                  </svg>
                </div>
                <blockquote className="mb-4">
                  "As a business owner, I use the payment links to collect payments from clients abroad. It's
                  professional and efficient, saving me time and money."
                </blockquote>
                <div>
                  <p className="font-semibold">Emma Thompson</p>
                  <p className="text-sm text-gray-500">Manchester, UK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Transferring?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who enjoy fast, secure, and affordable money transfers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
