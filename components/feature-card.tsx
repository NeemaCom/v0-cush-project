import type React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link?: string
}

export function FeatureCard({ icon, title, description, link }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {link && (
        <CardFooter>
          <Button
            asChild
            variant="ghost"
            className="p-0 h-auto font-medium text-teal-600 hover:text-teal-700 hover:bg-transparent"
          >
            <Link href={link} className="flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
