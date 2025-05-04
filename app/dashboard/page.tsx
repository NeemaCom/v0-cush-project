"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const transactions = [
    {
      id: "Fdftgcjykuoiurt67250317091139-7",
      date: "16/03/2025",
      time: "09:04:06 AM",
      amount: "£ 400.00",
      type: "Bank Transfer",
      category: "Debit",
      document: "Receipt",
      status: "Successful",
    },
    {
      id: "Ysagvnmlkagyers467830251563-9-2",
      date: "12/03/2025",
      time: "11:43:06 AM",
      amount: "£ 600.00",
      type: "Cash deposit",
      category: "Credit",
      document: "Receipt",
      status: "Failed",
    },
    {
      id: "Bxcdgjektailist738291673220-8-5",
      date: "11/03/2025",
      time: "02:10:06 PM",
      amount: "£ 100.00",
      type: "Withdrawal",
      category: "Credit",
      document: "Receipt",
      status: "Pending",
    },
    {
      id: "Zbinpowhcallist57893452817-69-1",
      date: "06/03/2025",
      time: "05:46:06 AM",
      amount: "£ 800.00",
      type: "Bank Transfer",
      category: "Debit",
      document: "Receipt",
      status: "Successful",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback>BW</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <h2 className="text-xl font-bold">Bankole Wellness</h2>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="20" height="16" rx="3" fill="#FF5F00" />
              <circle cx="9" cy="12" r="5" fill="#EB001B" />
              <circle cx="15" cy="12" r="5" fill="#F79E1B" />
              <path
                d="M12 7.5C13.3649 8.58333 14.0473 9.66667 14.0473 12C14.0473 14.3333 13.3649 15.4167 12 16.5C10.6351 15.4167 9.95276 14.3333 9.95276 12C9.95276 9.66667 10.6351 8.58333 12 7.5Z"
                fill="#FF5F00"
              />
            </svg>
            Add card
          </Button>
          <Button>View Profile</Button>
        </div>
      </div>

      {/* Balance and Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Total Balance : £2,764.21</CardTitle>
            <CardDescription>16, March 2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] relative">
              {/* Chart placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                  {/* Credit line (blue) */}
                  <path
                    d="M0,150 C50,120 100,140 150,100 C200,60 250,80 300,50 C350,20 400,40 400,20"
                    fill="none"
                    stroke="#3366FF"
                    strokeWidth="2"
                  />
                  {/* Debit line (orange) */}
                  <path
                    d="M0,100 C50,120 100,80 150,130 C200,150 250,90 300,110 C350,130 400,60 400,40"
                    fill="none"
                    stroke="#FF6B6B"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2"></div>
                <span className="text-sm">Debit</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3366FF] mr-2"></div>
                <span className="text-sm">Credit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">02123456762</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Loan balance</h3>
                <p className="text-2xl font-bold">£1,320.00</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Credit Limit</h3>
                <p className="text-2xl font-bold">£25,200.00</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button className="flex items-center justify-center gap-2" size="sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Apply
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2" size="sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Credit
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2" size="sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  History
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2" size="sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Transaction ID</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Document</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t border-gray-100">
                      <td className="py-3 text-sm">{transaction.id}</td>
                      <td className="py-3 text-sm">{transaction.date}</td>
                      <td className="py-3 text-sm">{transaction.time}</td>
                      <td className="py-3 text-sm">{transaction.amount}</td>
                      <td className="py-3 text-sm">{transaction.type}</td>
                      <td className="py-3 text-sm">{transaction.category}</td>
                      <td className="py-3 text-sm">
                        <div className="flex items-center">
                          {transaction.document}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1"
                          >
                            <path
                              d="M12 5V19M5 12H19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        <Badge
                          className={
                            transaction.status === "Successful"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : transaction.status === "Failed"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm text-gray-500">Total loan</div>
              <div className="text-sm font-medium text-right">£14,032.56</div>

              <div className="text-sm text-gray-500">Interest Rate</div>
              <div className="text-sm font-medium text-right">5%</div>

              <div className="text-sm text-gray-500">Loan obligation fee</div>
              <div className="text-sm font-medium text-right">2.5%</div>

              <div className="text-sm text-gray-500">Monthly fee</div>
              <div className="text-sm font-medium text-right">£1,339/month</div>

              <div className="text-sm text-gray-500">Early repayment option</div>
              <div className="text-sm font-medium text-right">Free</div>

              <div className="text-sm text-gray-500">Loan terms</div>
              <div className="text-sm font-medium text-right">11 months</div>

              <div className="text-sm text-gray-500">Loan to value</div>
              <div className="text-sm font-medium text-right">110%</div>

              <div className="text-sm text-gray-500">Tax</div>
              <div className="text-sm font-medium text-right">£0.00</div>

              <div className="text-sm text-gray-500">Collateral amount and type</div>
              <div className="text-sm font-medium text-right">£20,000.00</div>

              <div className="text-sm text-gray-500">Total loan cost</div>
              <div className="text-sm font-medium text-right">£15,734.188</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
