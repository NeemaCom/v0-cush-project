"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorData, setErrorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchErrorData = async () => {
      try {
        // Get current URL and query parameters
        const error = searchParams.get("error") || "unknown"

        // Fetch error details from the API
        const response = await fetch(`/api/auth/error?error=${error}`)
        const data = await response.json()

        setErrorData(data)
      } catch (err) {
        console.error("Failed to fetch error details:", err)
        setErrorData({
          error: "fetch_failed",
          message: "Failed to load error details",
          timestamp: new Date().toISOString(),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchErrorData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading error details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>There was a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{errorData?.error || "Error"}</AlertTitle>
            <AlertDescription>{errorData?.message || "An unknown error occurred"}</AlertDescription>
          </Alert>

          <div className="space-y-4 mt-4">
            <p className="text-sm text-gray-500">Error occurred at: {errorData?.timestamp || "Unknown time"}</p>
            {errorData?.description && (
              <p className="text-sm text-gray-500">Additional details: {errorData.description}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/login">Return to Login</Link>
          </Button>
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
