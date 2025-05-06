"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Logo from "@/components/logo"

export default function UnverifiedEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [isResending, setIsResending] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)
  const [resendSuccess, setResendSuccess] = useState<string | null>(null)

  async function handleResendVerification() {
    setIsResending(true)
    setResendError(null)
    setResendSuccess(null)

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setResendSuccess("Verification email sent. Please check your inbox.")
      } else {
        setResendError(data.message || "Failed to send verification email. Please try again.")
      }
    } catch (error) {
      setResendError("An unexpected error occurred. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <Logo />
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Email Not Verified</CardTitle>
            <CardDescription>
              Your email address has not been verified yet. Please check your inbox for a verification link.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {resendError && (
              <Alert variant="destructive">
                <AlertDescription>{resendError}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{resendSuccess}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                A verification email was sent to <strong>{email}</strong>. Please check your inbox and spam folder.
              </p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleResendVerification} disabled={isResending} className="w-full">
                {isResending ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Button variant="outline" onClick={() => router.push("/login")} className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Support
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
