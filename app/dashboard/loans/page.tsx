"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { v4 as uuidv4 } from "uuid"
import { Landmark, School, Briefcase, Home, Check, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { saveApplication } from "@/lib/redis"

const loanApplicationSchema = z.object({
  loanType: z.string().min(1, { message: "Please select a loan type." }),
  amount: z.string().min(1, { message: "Please enter an amount." }),
  purpose: z.string().min(10, { message: "Please provide a detailed purpose for the loan." }),
  duration: z.string().min(1, { message: "Please select a loan duration." }),
  employmentStatus: z.string().min(1, { message: "Please select your employment status." }),
  monthlyIncome: z.string().min(1, { message: "Please enter your monthly income." }),
})

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState("apply")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof loanApplicationSchema>>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanType: "",
      amount: "",
      purpose: "",
      duration: "",
      employmentStatus: "",
      monthlyIncome: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loanApplicationSchema>) {
    setIsSubmitting(true)

    try {
      // Generate a unique ID for the application
      const applicationId = uuidv4()

      // In a real app, you would get the user ID from authentication
      const userId = "user123"

      // Save the application to Redis
      await saveApplication("loan", applicationId, {
        id: applicationId,
        userId,
        status: "pending",
        createdAt: new Date().toISOString(),
        ...values,
      })

      setIsSuccess(true)
      form.reset()
    } catch (error) {
      console.error("Error submitting loan application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const loanTypes = [
    {
      id: "education",
      title: "Education Loan",
      description: "Finance your education or pay school fees",
      icon: <School className="h-10 w-10 text-primary" />,
      interestRate: "10%",
      maxAmount: "$25,000",
    },
    {
      id: "personal",
      title: "Personal Loan",
      description: "For personal expenses and emergencies",
      icon: <Landmark className="h-10 w-10 text-primary" />,
      interestRate: "12%",
      maxAmount: "$10,000",
    },
    {
      id: "business",
      title: "Business Loan",
      description: "Grow your business or start a new venture",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      interestRate: "15%",
      maxAmount: "$50,000",
    },
    {
      id: "mortgage",
      title: "Mortgage Loan",
      description: "Finance your home purchase or renovation",
      icon: <Home className="h-10 w-10 text-primary" />,
      interestRate: "8%",
      maxAmount: "$100,000",
    },
  ]

  const myLoans = [
    {
      id: "loan1",
      type: "Education Loan",
      amount: "$5,000",
      status: "Approved",
      date: "Apr 15, 2025",
      remainingAmount: "$4,500",
      nextPayment: "May 15, 2025",
    },
    {
      id: "loan2",
      type: "Personal Loan",
      amount: "$2,000",
      status: "Pending",
      date: "Apr 28, 2025",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Loan Services</h1>
        <p className="text-gray-500">Apply for loans and manage your existing loans</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
          <TabsTrigger value="myloans">My Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="apply" className="space-y-6">
          {isSuccess ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-center">Application Submitted!</CardTitle>
                <CardDescription className="text-center">
                  Your loan application has been submitted successfully. We will review your application and get back to
                  you shortly.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button
                  onClick={() => {
                    setIsSuccess(false)
                    setActiveTab("myloans")
                  }}
                >
                  View My Loans
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {loanTypes.map((loan) => (
                  <Card key={loan.id} className="h-full">
                    <CardHeader>
                      <div className="mb-2">{loan.icon}</div>
                      <CardTitle>{loan.title}</CardTitle>
                      <CardDescription>{loan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Interest Rate</span>
                          <span className="font-medium">{loan.interestRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Max Amount</span>
                          <span className="font-medium">{loan.maxAmount}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => {
                          form.setValue("loanType", loan.id)
                          document.getElementById("loan-application-form")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <Card id="loan-application-form">
                <CardHeader>
                  <CardTitle>Loan Application</CardTitle>
                  <CardDescription>
                    Fill out the form below to apply for a loan. We will review your application and get back to you
                    shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="loanType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select loan type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="education">Education Loan</SelectItem>
                                <SelectItem value="personal">Personal Loan</SelectItem>
                                <SelectItem value="business">Business Loan</SelectItem>
                                <SelectItem value="mortgage">Mortgage Loan</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Amount</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter amount" {...field} />
                            </FormControl>
                            <FormDescription>Enter the amount in USD</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Purpose</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Explain the purpose of this loan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loan Duration</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select loan duration" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="3">3 months</SelectItem>
                                <SelectItem value="6">6 months</SelectItem>
                                <SelectItem value="12">12 months</SelectItem>
                                <SelectItem value="24">24 months</SelectItem>
                                <SelectItem value="36">36 months</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employmentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employment status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="employed">Employed</SelectItem>
                                <SelectItem value="self-employed">Self-Employed</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="unemployed">Unemployed</SelectItem>
                                <SelectItem value="retired">Retired</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="monthlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Income</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Enter monthly income" {...field} />
                            </FormControl>
                            <FormDescription>Enter the amount in USD</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="myloans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Loans</CardTitle>
              <CardDescription>View and manage your existing loans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myLoans.map((loan) => (
                  <Card key={loan.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:w-2/3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{loan.type}</h3>
                            <p className="text-sm text-gray-500">Applied on {loan.date}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`
                              ${loan.status === "Approved" ? "bg-green-50 text-green-600 border-green-200" : ""}
                              ${loan.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" : ""}
                            `}
                          >
                            {loan.status}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold">{loan.amount}</div>

                        {loan.status === "Approved" && (
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Remaining Amount:</span>
                              <span>{loan.remainingAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Next Payment:</span>
                              <span>{loan.nextPayment}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-50 p-4 flex items-center justify-center md:w-1/3">
                        <Button variant="outline" className="w-full">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {myLoans.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any loans yet.</p>
                    <Button className="mt-4" onClick={() => setActiveTab("apply")}>
                      Apply for a Loan
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
