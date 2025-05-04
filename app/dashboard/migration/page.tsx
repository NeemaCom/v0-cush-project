"use client"

import Link from "next/link"
import { FileText, Globe, ArrowRight, Check, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function MigrationPage() {
  const applications = [
    {
      id: "app1",
      type: "Police Character Certificate",
      status: "In Progress",
      progress: 60,
      submittedDate: "Apr 26, 2025",
      estimatedCompletion: "May 10, 2025",
    },
  ]

  const services = [
    {
      id: "police-certificate",
      title: "Police Character Certificate",
      description: "Official certificate confirming your criminal record status",
      icon: <FileText className="h-10 w-10 text-primary" />,
      features: [
        "Required for visa applications",
        "International recognition",
        "Digital and physical copies available",
      ],
      link: "/dashboard/migration/police-certificate",
    },
    {
      id: "visa-assistance",
      title: "Visa Application Assistance",
      description: "Expert guidance through the visa application process",
      icon: <Globe className="h-10 w-10 text-primary" />,
      features: ["Document preparation", "Application review", "Interview preparation"],
      link: "/dashboard/migration/visa-assistance",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Migration Services</h1>
        <p className="text-gray-500">Manage your migration applications and services</p>
      </header>

      {applications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{application.type}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Submitted: {application.submittedDate}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                        {application.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Submitted: {application.submittedDate}</span>
                        <span>Est. Completion: {application.estimatedCompletion}</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-4">Available Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="h-full">
              <CardHeader>
                <div className="mb-2">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 h-4 w-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={service.link}>
                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
