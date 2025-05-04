"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle2, Clock, AlertTriangle, HelpCircle, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, formatDistanceToNow } from "date-fns"

// Define types for application tracking
interface ApplicationStep {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | "rejected"
  completedAt?: string
  notes?: string
}

interface Application {
  id: string
  userId: string
  type: "police-certificate" | "visa" | "passport" | "other"
  reference: string
  status: "submitted" | "processing" | "approved" | "rejected" | "cancelled"
  createdAt: string
  updatedAt: string
  steps: ApplicationStep[]
}

export default function StatusTrackerPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    const fetchApplications = async () => {
      if (!session?.user?.id) return

      try {
        setLoading(true)
        // In a real app, this would fetch from your API
        // For now, we'll use mock data
        setTimeout(() => {
          setApplications(mockApplications)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching applications:", error)
        toast({
          title: "Error",
          description: "Failed to fetch your applications",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchApplications()
    }
  }, [session, toast])

  const filteredApplications = activeTab === "all" ? applications : applications.filter((app) => app.type === activeTab)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "pending":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
      case "rejected":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <HelpCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "submitted":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Submitted
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Processing
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // This would typically come from your backend
  const mockApplications: Application[] = [
    {
      id: "app-1",
      userId: session?.user?.id || "",
      type: "police-certificate",
      reference: "PC-2023-001",
      status: "processing",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      steps: [
        {
          id: "step-1",
          title: "Application Submitted",
          description: "Your application has been received and payment confirmed",
          status: "completed",
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "step-2",
          title: "Document Verification",
          description: "Your documents are being verified by our team",
          status: "completed",
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "step-3",
          title: "Background Check",
          description: "Background check in progress with relevant authorities",
          status: "in-progress",
        },
        {
          id: "step-4",
          title: "Certificate Issuance",
          description: "Your certificate will be issued after successful background check",
          status: "pending",
        },
      ],
    },
    {
      id: "app-2",
      userId: session?.user?.id || "",
      type: "visa",
      reference: "VS-2023-042",
      status: "submitted",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      steps: [
        {
          id: "step-1",
          title: "Application Submitted",
          description: "Your visa application has been received",
          status: "completed",
          completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "step-2",
          title: "Initial Review",
          description: "Your application is being reviewed by our team",
          status: "pending",
        },
        {
          id: "step-3",
          title: "Embassy Processing",
          description: "Your application will be forwarded to the embassy",
          status: "pending",
        },
        {
          id: "step-4",
          title: "Visa Decision",
          description: "Final decision on your visa application",
          status: "pending",
        },
      ],
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Application Status Tracker</h1>
        <p className="text-gray-500">Track the status of your migration applications</p>
      </header>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="police-certificate">Police Certificate</TabsTrigger>
          <TabsTrigger value="visa">Visa</TabsTrigger>
          <TabsTrigger value="passport">Passport</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
            <p className="text-gray-500 text-center mb-6">
              {activeTab === "all"
                ? "You haven't submitted any applications yet."
                : `You don't have any ${activeTab} applications.`}
            </p>
            <Button asChild>
              <a href="/dashboard/migration">Start New Application</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {application.reference}
                      {getStatusBadge(application.status)}
                    </CardTitle>
                    <CardDescription>
                      {application.type.charAt(0).toUpperCase() + application.type.slice(1).replace("-", " ")} •
                      Submitted {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/migration/applications/${application.id}`}>View Details</a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative">
                  {application.steps.map((step, index) => (
                    <div key={step.id} className="flex mb-8 last:mb-0">
                      <div className="flex flex-col items-center mr-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full z-10 bg-white">
                          {getStatusIcon(step.status)}
                        </div>
                        {index < application.steps.length - 1 && (
                          <div
                            className={`w-0.5 h-full ${step.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                          ></div>
                        )}
                      </div>
                      <div className="pt-1 pb-8">
                        <h3 className="text-lg font-medium">{step.title}</h3>
                        <p className="text-gray-500 mb-1">{step.description}</p>
                        {step.completedAt && (
                          <p className="text-xs text-gray-400">
                            Completed on {format(new Date(step.completedAt), "PPP")}
                          </p>
                        )}
                        {step.notes && <p className="text-sm mt-2 p-2 bg-gray-50 rounded">{step.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
