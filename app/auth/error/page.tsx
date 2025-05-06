"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An authentication error occurred")
  const [errorType, setErrorType] = useState<string>("unknown")
  const [loading, setLoading] = useState(true)
  const [errorDetails, setErrorDetails] = useState<string>("")

  useEffect(() => {
    const fetchErrorData = async () => {
      try {
        // Get error from URL parameters
        const error = searchParams?.get("error") || "unknown"
        setErrorType(error)

        // Try to fetch detailed error information from the API
        try {
          console.log("Fetching error details for:", error)
          const response = await fetch(`/api/auth/error?error=${encodeURIComponent(error)}`)

          if (response.ok) {
            const data = await response.json()
            console.log("Error API response:", data)
            setErrorMessage(data.message || "An authentication error occurred")
            setErrorDetails(data.description || "")
          } else {
            console.error("Error API response not OK:", response.status)
            // Fallback to client-side error mapping if API call fails
            mapErrorToMessage(error)
          }
        } catch (fetchError) {
          console.error("Failed to fetch error details:", fetchError)
          // Fallback to client-side error mapping if API call fails
          mapErrorToMessage(error)
        }
      } catch (err) {
        console.error("Error in auth error page:", err)
        setErrorMessage("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    const mapErrorToMessage = (error: string) => {
      // Map error codes to user-friendly messages (client-side fallback)
      switch (error) {
        case "Configuration":
          setErrorMessage("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setErrorMessage("You do not have permission to sign in.")
          break
        case "Verification":
          setErrorMessage("The verification link is invalid or has expired.")
          break
        case "OAuthSignin":
        case "OAuthCallback":
        case "OAuthCreateAccount":
        case "EmailCreateAccount":
        case "Callback":
        case "OAuthAccountNotLinked":
        case "EmailSignin":
        case "CredentialsSignin":
          setErrorMessage("There was a problem with your sign-in attempt. Please try again.")
          break
        case "SessionRequired":
          setErrorMessage("You must be signed in to access this page.")
          break
        default:
          setErrorMessage("An unexpected authentication error occurred.")
      }
    }

    fetchErrorData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p>Loading error details...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">We encountered a problem with your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error: {errorType}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>

          {errorDetails && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Additional details: {errorDetails}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
