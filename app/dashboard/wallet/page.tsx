"use client"

import { useState } from "react"
import { CreditCard, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("cards")

  const cards = [
    {
      id: 1,
      type: "Virtual",
      name: "USD Dollar Card",
      number: "**** **** **** 4582",
      balance: "$1,250.00",
      expires: "04/28",
      status: "Active",
      color: "bg-gradient-to-r from-[#3366FF] to-[#5B8DEF]",
    },
    {
      id: 2,
      type: "Virtual",
      name: "EUR Euro Card",
      number: "**** **** **** 7291",
      balance: "€980.00",
      expires: "06/27",
      status: "Active",
      color: "bg-gradient-to-r from-[#FF6B6B] to-[#FF9E9E]",
    },
    {
      id: 3,
      type: "Physical",
      name: "GBP Pound Card",
      number: "**** **** **** 1458",
      balance: "£2,340.00",
      expires: "09/26",
      status: "Inactive",
      color: "bg-gradient-to-r from-[#6B66FF] to-[#9E9EFF]",
    },
  ]

  const transactions = [
    {
      id: "TX123456789",
      date: "16/03/2025",
      description: "Amazon Purchase",
      amount: "-$45.99",
      status: "Completed",
      type: "outgoing",
    },
    {
      id: "TX987654321",
      date: "15/03/2025",
      description: "Salary Deposit",
      amount: "+$2,500.00",
      status: "Completed",
      type: "incoming",
    },
    {
      id: "TX456789123",
      date: "14/03/2025",
      description: "Netflix Subscription",
      amount: "-$14.99",
      status: "Completed",
      type: "outgoing",
    },
    {
      id: "TX789123456",
      date: "12/03/2025",
      description: "Freelance Payment",
      amount: "+$350.00",
      status: "Completed",
      type: "incoming",
    },
    {
      id: "TX321654987",
      date: "10/03/2025",
      description: "Grocery Store",
      amount: "-$78.35",
      status: "Completed",
      type: "outgoing",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Wallet</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New Card
        </Button>
      </div>

      <Tabs defaultValue="cards" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className={`text-white overflow-hidden ${card.color}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm opacity-80">
                        {card.type} {card.name}
                      </p>
                      <p className="font-mono mt-1">{card.number}</p>
                    </div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {card.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs opacity-80">BALANCE</p>
                      <p className="text-xl font-bold">{card.balance}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">EXPIRES</p>
                      <p>{card.expires}</p>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-black/10 p-4 flex justify-between">
                  <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                    View Details
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                    Fund Card
                  </Button>
                </div>
              </Card>
            ))}

            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-[200px]">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Add New Card</p>
              <p className="text-gray-400 text-sm text-center mt-2">Virtual or physical cards for your needs</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Card Settings</CardTitle>
              <CardDescription>Manage your card preferences and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <CreditCard className="h-5 w-5 text-[#3366FF]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Card Limits</h3>
                    <p className="text-sm text-gray-500">Set spending limits for your cards</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-[#3366FF]"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Security Settings</h3>
                    <p className="text-sm text-gray-500">Manage 3D secure and other security features</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-[#3366FF]"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Fraud Protection</h3>
                    <p className="text-sm text-gray-500">Configure fraud detection settings</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View and manage your recent card transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full mr-4 ${
                          transaction.type === "incoming" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-5 w-5 ${transaction.type === "incoming" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "incoming" ? (
                            <path d="M12 3v18M3 15l9 9 9-9" />
                          ) : (
                            <path d="M12 21V3M3 9l9-9 9 9" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">
                          {transaction.date} • {transaction.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${transaction.type === "incoming" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount}
                      </p>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">View All Transactions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Settings</CardTitle>
              <CardDescription>Configure your wallet preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-[#3366FF]"
                    >
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Notifications</h3>
                    <p className="text-sm text-gray-500">Configure transaction alerts and notifications</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-[#3366FF]"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Auto Top-up</h3>
                    <p className="text-sm text-gray-500">Set up automatic card funding</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-[#3366FF]"
                    >
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Default Funding Source</h3>
                    <p className="text-sm text-gray-500">Set your preferred funding method</p>
                  </div>
                </div>
                <Button variant="ghost">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
