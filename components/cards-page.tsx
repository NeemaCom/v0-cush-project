"use client"

import Link from "next/link"
import { ArrowLeft, CreditCard, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CardsPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-teal-600 mb-4 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Virtual & Physical Cards</h1>
        <p className="text-gray-500 max-w-3xl">
          Access virtual dollar cards and physical debit cards for seamless transactions worldwide. Our cards are
          designed for security, convenience, and global accessibility.
        </p>
      </div>

      <Tabs defaultValue="virtual" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="virtual">Virtual Cards</TabsTrigger>
          <TabsTrigger value="physical">Physical Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="virtual" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <CreditCard className="h-10 w-10 text-teal-600" />
                </div>
                <CardTitle>Dollar Card</CardTitle>
                <CardDescription>Virtual USD card for online transactions and subscriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Card Fee</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Monthly Limit</span>
                    <span className="font-medium">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction Fee</span>
                    <span className="font-medium">1.5%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>3D Secure Protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>Instant Issuance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <CreditCard className="h-10 w-10 text-teal-600" />
                </div>
                <CardTitle>Euro Card</CardTitle>
                <CardDescription>Virtual EUR card for European transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Card Fee</span>
                    <span className="font-medium">€5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Monthly Limit</span>
                    <span className="font-medium">€8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction Fee</span>
                    <span className="font-medium">1.5%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>3D Secure Protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>Instant Issuance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <CreditCard className="h-10 w-10 text-teal-600" />
                </div>
                <CardTitle>Pound Card</CardTitle>
                <CardDescription>Virtual GBP card for UK transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Card Fee</span>
                    <span className="font-medium">£5.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Monthly Limit</span>
                    <span className="font-medium">£7,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transaction Fee</span>
                    <span className="font-medium">1.5%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>3D Secure Protection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>Instant Issuance</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Virtual Card Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Global Acceptance</h3>
                <p className="text-sm text-gray-600">
                  Use your virtual card for online purchases anywhere in the world.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Enhanced Security</h3>
                <p className="text-sm text-gray-600">
                  Protect your main account with a separate card for online transactions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Instant Creation</h3>
                <p className="text-sm text-gray-600">Create and start using your virtual card within minutes.</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="physical" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="mb-2">
                  <CreditCard className="h-10 w-10 text-teal-600" />
                </div>
                <CardTitle>Standard Debit Card</CardTitle>
                <CardDescription>Physical card for everyday transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Card Fee</span>
                    <span className="font-medium">$10.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ATM Withdrawal</span>
                    <span className="font-medium">$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Delivery Time</span>
                    <span className="font-medium">5-7 business days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>Contactless Payments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>Global ATM Access</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Order Card</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2">
                  <CreditCard className="h-10 w-10 text-teal-600" />
                </div>
                <CardTitle>Premium Debit Card</CardTitle>
                <CardDescription>Enhanced features and benefits for frequent users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Card Fee</span>
                    <span className="font-medium">$20.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">ATM Withdrawal</span>
                    <span className="font-medium">Free (up to 5/month)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Delivery Time</span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span>Travel Insurance Included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-teal-600" />
                  <span>Priority Customer Support</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Order Card</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Physical Card Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">In-Person Payments</h3>
                <p className="text-sm text-gray-600">
                  Use your card for in-store purchases and ATM withdrawals worldwide.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Contactless Technology</h3>
                <p className="text-sm text-gray-600">
                  Tap to pay for quick and secure transactions at compatible terminals.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Travel Companion</h3>
                <p className="text-sm text-gray-600">
                  Access your funds easily while traveling with global ATM compatibility.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How secure are your cards?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Our cards feature advanced security measures including 3D Secure authentication, real-time transaction
                monitoring, and the ability to freeze/unfreeze your card instantly from the app.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How long does it take to get a virtual card?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Virtual cards are created instantly after your account verification is complete. You can start using
                your virtual card for online transactions immediately.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I use my card internationally?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Yes, both our virtual and physical cards can be used for international transactions. Our competitive
                exchange rates make them ideal for travel and global purchases.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I fund my card?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You can fund your card through bank transfers, debit card top-ups, or by transferring funds from your
                main account balance. All funding methods are processed instantly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who enjoy the convenience and security of our card solutions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
